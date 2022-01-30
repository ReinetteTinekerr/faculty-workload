import { Layout } from "antd";
import { ISUFooter } from "components/layout/footer";
import WorkloadLayout from "components/layout/WorkloadLayout";
import { WorkloadContentList } from "components/workload/workloadContentList";
import WorkloadHeader from "components/workload/workloadHeader";
import { WorkloadModal } from "components/workload/workloadModal";
import { ProgressSider } from "components/workload/workloadSider";
import { AuthUser } from "constants/interface/firebaseUser";
import { WorkloadDataProps } from "constants/interface/formProps";
import Head from "next/head";
import { useState } from "react";
import { useAuthSession } from "utils/hooks";

interface WorkloadIndexProps {
  workloadList: WorkloadDataProps[] | [];
}

export default function WorkloadIndex({
  workloads,
  user,
  userData,
  workloadsInProgress,
  approvedWorkloads,
}: any) {
  const [visible, setVisible] = useState(false);
  // const { user, userData } = useAuthSession();
  return (
    <>
      <WorkloadLayout headerTitle="ISU Faculty">
        <Layout>
          <Layout>
            <WorkloadContentList
              setVisible={setVisible}
              workloads={workloads}
              workloadsInProgress={workloadsInProgress}
              approvedWorkloads={approvedWorkloads}
            />
          </Layout>
          <WorkloadModal
            setVisible={setVisible}
            visible={visible}
            user={user}
            userData={userData}
          />
          {/* <ProgressSider /> */}
        </Layout>
      </WorkloadLayout>
    </>
  );
}
