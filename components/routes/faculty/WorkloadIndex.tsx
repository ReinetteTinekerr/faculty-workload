import { Layout } from "antd";
import WorkloadLayout from "components/layout/WorkloadLayout";
import { WorkloadContentList } from "components/workload/workloadContentList";
import { WorkloadModal } from "components/workload/workloadModal";
import { useState } from "react";
import LoadingScreen from "components/layout/loadingScreen";

export default function WorkloadIndex({
  user,
  userData,
  facultyMembers,
  workloads,
  selectedSchoolYear,
  setSelectedSchoolYear,
}: any) {
  const [visible, setVisible] = useState(false);

  if (!workloads) {
    return <LoadingScreen />;
  }

  return (
    <>
      <WorkloadLayout headerTitle="ISU Faculty">
        <Layout>
          <Layout>
            <WorkloadContentList
              setVisible={setVisible}
              workloads={workloads}
              setSelectedSchoolYear={setSelectedSchoolYear}
              selectedSchoolYear={selectedSchoolYear}
            />
          </Layout>
          <WorkloadModal
            workloads={workloads}
            setVisible={setVisible}
            visible={visible}
            user={user}
            userData={userData}
            facultyMembers={facultyMembers}
          />
        </Layout>
      </WorkloadLayout>
    </>
  );
}
