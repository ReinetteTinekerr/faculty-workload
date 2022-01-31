import { Button, Form, Modal, message, FormInstance } from "antd";
import {
  UndergraduateDataProps,
  WorkloadDataProps,
  GraduateDataProps,
} from "constants/interface/formProps";
import { ShowModalProps } from "constants/interface/workloadProps";
import { createContext, useState } from "react";
import WorkloadForm from "./workloadForm";

import { User } from "firebase/auth";
import {
  getUsersByCampusAndRole,
  uploadWorkloadToFirestore,
} from "../../firebase/firestoreQueries";
import { getValidators } from "utils/utils";

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
export const WorkloadFormContext = createContext<FormInstance<any> | null>(
  null
);

export function WorkloadModal({
  visible,
  setVisible,
  user,
  userData,
}: ShowModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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

    try {
      const values: WorkloadDataProps = await form.validateFields();
      if (values.undergraduate === undefined && values.graduate === undefined) {
        message.error("Table is empty");
        throw "table is empty";
      }

      if (!userData.signature) {
        message.error("Please check your profile and provide a signature");
        return { success: false };
      }

      const dataWithId = await updateAndUploadValuesToFirestore(
        values,
        user,
        userData!.campusId,
        userData!.signature
      );
      message.success("Workload created Woohoo!");

      console.log("Success:", dataWithId);
      return { success: true };
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
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
        initialValues={{
          name: userData?.username,
          masteral: userData?.masteral,
          college: userData?.college,
          campus: userData?.campus,
          doctorate: userData?.doctorate,
          baccalaureate: userData?.baccalaureate,
        }}
        {...formItemLayout}
        form={form}
        name="createWorkload"
        scrollToFirstError
      >
        <WorkloadFormContext.Provider value={form}>
          <WorkloadForm />
        </WorkloadFormContext.Provider>
      </Form>
    </Modal>
  );
}
async function updateAndUploadValuesToFirestore(
  values: WorkloadDataProps,
  user: User,
  campusId: string,
  ownerSignature: string
) {
  // const campusRef = doc(db, "campuses", campusId);
  // const campusSnap = await getDoc(campusRef);
  // let campusData = null;

  // if (campusSnap.exists()) {
  //   campusData = campusSnap.data() as CampusProps;
  //   console.log(campusData);
  // } else {
  //   console.log("No such document!");
  //   return;
  // }
  const validatorsData = await getUsersByCampusAndRole(campusId, "VALIDATOR");

  const validators = getValidators(validatorsData, values.college);

  const withTotalOfWorkloads = EvaluateWorkload(values);

  const uploadedWorkload = await uploadWorkloadToFirestore(
    withTotalOfWorkloads,
    campusId,
    user.uid,
    validators,
    ownerSignature
  );
  console.log(uploadedWorkload);

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
    extensionProductionSum;

  excessFacultyWorkload = totalFacultyWorkload - 21;

  const withFTE = {
    ...values,
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
