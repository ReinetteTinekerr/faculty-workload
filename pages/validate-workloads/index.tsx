import Layout, { Content } from "antd/lib/layout/layout";
import LoadingScreen from "components/layout/loadingScreen";
import WorkloadLayout from "components/layout/WorkloadLayout";
import UserProfile from "components/routes/faculty/UserProfile";
import { ActiveComponent } from "constants/enums/activeComponent";
import { ActiveComponentContext } from "context/activeComponentContext";
import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { useAuthSession } from "utils/hooks";
import { Tabs } from "antd";
import { AuditOutlined, FormOutlined } from "@ant-design/icons";
import WorkloadItem from "components/routes/faculty/WorkloadItem";

import { WorkloadList } from "components/workload/WorkloadList";
import {
  getFacultyWorkloads,
  getValidatedWorkloads,
} from "../../firebase/firestoreQueries";
import Head from "next/head";
const { TabPane } = Tabs;

const ValidateWorkloads: NextPage = () => {
  const [user, loading, error, userRole, userData] = useAuthSession();
  const [facultyWorkloads, setFacultyWorkloads] = useState<any>(null);
  const [validatedWorkloads, setValidatedWorkloads] = useState<any>(null);
  const { activeComponent, setActiveComponent, setSelectedItem, selectedItem } =
    useContext(ActiveComponentContext)!;

  useEffect(() => {
    if (!userData || !user) return;
    getFacultyWorkloads(
      userData.campus,
      userData.positionIndex,
      setFacultyWorkloads
    );
  }, [userData, user]);

  useEffect(() => {
    if (!userData || !user) return;
    const unsubscribe = getValidatedWorkloads(
      userData.campusId,
      userData.positionIndex,
      setValidatedWorkloads
    );
  }, [userData, user]);

  if (
    loading ||
    userRole === null ||
    facultyWorkloads === null ||
    user == null
  ) {
    return <LoadingScreen />;
  }

  if (activeComponent === ActiveComponent.Profile) {
    return <UserProfile userData={userData} />;
  }
  if (activeComponent === ActiveComponent.WorkloadItem) {
    return (
      <WorkloadItem
        workload={selectedItem!}
        role={userRole}
        positionIndex={userData.positionIndex}
        campusId={userData.campusId}
      />
    );
  }
  return (
    <>
      <Head>
        <title>Faculty Workload</title>
        <meta
          name="description"
          content="This project was developed by BSCS Students from ISU Echague"
        />
        <link rel="icon" href="/isu-logo.ico" />
      </Head>
      <WorkloadLayout headerTitle="ISU Validator">
        <Layout>
          <Content
            style={{ margin: "0px 10px", background: "#fff", overflow: "auto" }}
          >
            <Tabs defaultActiveKey="1" onChange={() => {}} centered>
              <TabPane
                tab={
                  <span>
                    <FormOutlined /> Pending
                  </span>
                }
                key="1"
              >
                <WorkloadList workloads={facultyWorkloads} />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <AuditOutlined /> Validated
                  </span>
                }
                key="2"
              >
                <WorkloadList workloads={validatedWorkloads} />
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </WorkloadLayout>
    </>
  );
};

export default ValidateWorkloads;
