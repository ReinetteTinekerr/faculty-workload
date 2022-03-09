import { Button, Form, Modal, message, FormInstance } from "antd";
import {
  UndergraduateDataProps,
  WorkloadDataProps,
  GraduateDataProps,
} from "constants/interface/formProps";
import { ShowModalProps } from "constants/interface/workloadProps";
import { createContext, useEffect, useState } from "react";
import WorkloadForm from "./workloadForm";

import {
  getUsersByCampusAndRole,
  uploadWorkloadToFirestore,
} from "../../firebase/firestoreQueries";
import { getSchoolYear, getValidators } from "utils/utils";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
    md: { span: 10 },
    lg: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 8 },
  },
};
export const WorkloadFormContext = createContext<any>(null);

export function WorkloadModal({
  visible,
  setVisible,
  user,
  userData,
  facultyMembers,
  programChairMembers,
  workloads,
}: ShowModalProps) {
  facultyMembers = facultyMembers === undefined ? null : facultyMembers;
  // console.log(facultyMembers);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [workloadUser, setWorkloadUser] = useState(null);
  const [workloadUsers, setWorkloadUsers] = useState(null);
  const formInitialValues =
    userData?.role === "COLLEGE_SECRETARY"
      ? {
          campus: userData?.campus,
          college: userData?.college,
          positionUnits: 0,
        }
      : {
          name: userData?.username,
          masteral: userData?.masteral,
          college: userData?.college,
          campus: userData?.campus,
          doctorate: userData?.doctorate,
          baccalaureate: userData?.baccalaureate,
          positionUnits: 0,
        };

  useEffect(() => {
    if (userData?.role === "COLLEGE_SECRETARY") {
    }
  }, [workloadUsers]);

  // useEffect(() => {
  //   if (loading) {
  //     onCheck().then(({ success }) => {
  //       if (success) {
  //         setVisible(false);
  //       }
  //     });
  //   }
  //   return () => {
  //     setLoading(false);
  //   };
  // }, [loading, setVisible]);

  const onCheck = async () => {
    if (!user || !userData) {
      return { success: false };
    }
    let faculty: any = userData; // signature may change if the role is COLLEGE_SECRETARY

    try {
      const values: WorkloadDataProps = await form.validateFields();
      if (workloads) {
        const workload = workloads.filter((workload: any) => {
          return workload.workload.semester == values.semester;
        });
        console.log(workloads, "loads");

        if (workload.length >= 1 && userData.role !== "COLLEGE_SECRETARY") {
          message.error("ERROR: Duplicate workload in a semester");
          throw "Duplicate workload in a semester";
        }
      }
      if (
        workloads &&
        workloads.length >= 3 &&
        userData.role !== "COLLEGE_SECRETARY"
      ) {
        message.error("ERROR: Maximum of 3 workloads per school year");
        throw "Invalid workload length";
      }

      if (values.undergraduate === undefined && values.graduate === undefined) {
        message.error("Table is empty");
        throw "table is empty";
      }

      if (userData?.role === "COLLEGE_SECRETARY") {
        const member = facultyMembers?.filter(
          (member: any) => member.username == values.name
        )[0];
        if (member) {
          faculty = member;
        }
      }

      const selectedProgramChair = programChairMembers?.filter(
        (member: any) => member.uid === values.programChair
      )[0];
      // console.log(selectedProgramChair);

      if (!faculty.signature) {
        message.error("Please provide a signature");
        return { success: false };
      }

      const dataWithId = await updateAndUploadValuesToFirestore(
        values,
        faculty.uid,
        faculty!.campusId,
        faculty!.signature,
        selectedProgramChair
      );
      message.success("Workload created Woohoo!");

      return { success: true };
    } catch (errorInfo) {
      return { success: false, errorInfo };
    }
  };

  return (
    <Modal
      centered={true}
      maskClosable={false}
      width={1000}
      visible={visible}
      title="ISABELA STATE UNIVERSITY | FACULTY WORKLOAD"
      onCancel={() => setVisible(false)}
      footer={[
        <Button key="back" onClick={() => setVisible(false)}>
          CANCEL
        </Button>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          loading={loading}
          onClick={async () => {
            setLoading(true);
            const { success } = await onCheck();
            setLoading(false);
            if (success) {
              setVisible(false);
            }
          }}
        >
          CREATE
        </Button>,
      ]}
    >
      <Form
        initialValues={formInitialValues}
        {...formItemLayout}
        form={form}
        name="createWorkload"
        scrollToFirstError
      >
        <WorkloadFormContext.Provider
          value={{ form, facultyMembers, programChairMembers }}
        >
          <WorkloadForm />
        </WorkloadFormContext.Provider>
      </Form>
    </Modal>
  );
}
async function updateAndUploadValuesToFirestore(
  values: WorkloadDataProps,
  userId: string,
  campusId: string,
  ownerSignature: string,
  selectedProgramChair: any
) {
  // const campusRef = doc(db, "campuses", campusId);
  // const campusSnap = await getDoc(campusRef);
  // let campusData = null;

  // if (campusSnap.exists()) {
  //   campusData = campusSnap.data() as CampusProps;
  //
  // } else {
  //
  //   return;
  // }

  const validatorsData = await getUsersByCampusAndRole(campusId, "VALIDATOR");

  const validators = getValidators(
    validatorsData,
    values.college,
    selectedProgramChair
  );
  console.log(validators, "validators");

  const withTotalOfWorkloads = EvaluateWorkload(values);

  const uploadedWorkload = await uploadWorkloadToFirestore(
    withTotalOfWorkloads,
    campusId,
    userId,
    validators,
    ownerSignature,
    selectedProgramChair.uid
  );

  return uploadedWorkload;
}

function EvaluateWorkload(values: WorkloadDataProps) {
  let undergraduateWithFTEresult: any = [];
  let undergraduateSumFTE = 0;
  let graduateSumCreditUnits = 0;
  let totalFacultyWorkload = 0;
  let excessFacultyWorkload = 0;
  let researchUnitsSum = 0;
  let extensionProductionSum = 0;

  if (values.undergraduate !== undefined) {
    undergraduateWithFTEresult = values.undergraduate.map(
      (row: UndergraduateDataProps) => {
        const labHrs = Number(row.labHours);
        const lecHrs = Number(row.lecHours);
        const totalFTE = labHrs + lecHrs;
        undergraduateSumFTE += totalFTE;
        return { ...row, lecFTE: lecHrs, labFTE: labHrs, totalFTE: totalFTE };
      }
    );
  }

  if (values.graduate !== undefined) {
    values.graduate.forEach((row: GraduateDataProps) => {
      const lecUnits = Number(row.lecCreditUnits);
      const labUnits = Number(row.labCreditUnits);
      const totalUnits = labUnits + lecUnits;
      graduateSumCreditUnits += totalUnits;
    });
  }

  if (values.research !== undefined) {
    values.research.forEach((row: any) => {
      const units = Number(row.units);
      researchUnitsSum += units;
    });
  }
  if (values.production !== undefined) {
    values.production.forEach((row: any) => {
      const units = Number(row.units);
      extensionProductionSum += units;
    });
  }

  totalFacultyWorkload +=
    undergraduateSumFTE +
    graduateSumCreditUnits +
    researchUnitsSum +
    extensionProductionSum +
    values.positionUnits;

  excessFacultyWorkload = totalFacultyWorkload - 21;

  const schoolYear = getSchoolYear(values.schoolYear);
  const withFTE = {
    ...values,
    schoolYear,
    undergraduate: undergraduateWithFTEresult,
    undergraduateSumFTE,
    graduateSumCreditUnits: graduateSumCreditUnits,
    researchUnitsSum,
    extensionProductionSum,
    totalFacultyWorkload,
    excessFacultyWorkload,
  };
  return withFTE;
}
