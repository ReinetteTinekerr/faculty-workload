import Layout, { Content } from "antd/lib/layout/layout";
import LoadingScreen from "components/layout/loadingScreen";
import WorkloadLayout from "components/layout/WorkloadLayout";
import UserProfile from "components/routes/faculty/UserProfile";
import { ActiveComponent } from "constants/enums/activeComponent";
import { ActiveComponentContext } from "context/activeComponentContext";
import type { NextPage } from "next";
import { Component, useContext, useEffect, useRef, useState } from "react";
import { useAuthSession } from "utils/hooks";
import { Tabs, Collapse, Typography, Empty, Table, Button, Row } from "antd";
import { SolutionOutlined, OrderedListOutlined } from "@ant-design/icons";
import WorkloadItem from "components/routes/faculty/WorkloadItem";
import styles from "styles/ID.module.css";

import { WorkloadList } from "components/workload/WorkloadList";
import {
  getFacultyWorkloads,
  getProgramChairs,
} from "../../firebase/firestoreService";
import Head from "next/head";
import {
  getCurrentSchoolYear,
  getCurrentSemester,
  groupByKey,
  openNotification,
  toSummaryObject,
} from "utils/utils";
import { summaryColumns } from "data/data";
import ReactToPrint from "react-to-print";
import { DropdownSchoolYearAndSemester } from "components/workload/schoolYearAndSemesterDropdown";
import { SummaryTab } from "components/workload/SummaryTab";
import { WorkloadsTab } from "components/workload/WorkloadsTab";
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Title } = Typography;

const ValidateWorkloads: NextPage = () => {
  const [user, loading, error, userRole, userData] = useAuthSession();
  const [facultyWorkloads, setFacultyWorkloads] = useState<[any] | null>(null);
  const { activeComponent, setActiveComponent, setSelectedItem, selectedItem } =
    useContext(ActiveComponentContext)!;
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>(
    getCurrentSemester()
  );

  // Initialize
  useEffect(() => {
    const storedSchoolYear = localStorage.getItem("schoolYear");
    const storedCollege = localStorage.getItem("college");
    setSelectedSchoolYear(
      !storedSchoolYear ? getCurrentSchoolYear() : storedSchoolYear
    );
    setSelectedCollege(!storedCollege ? "" : storedCollege);
  }, []);

  // Get Workloads
  useEffect(() => {
    if (!userData || !user) return;
    if (userData.position.toLowerCase().includes("program chairman")) return;

    const unsubscribe = getFacultyWorkloads(
      userData.campus,
      setFacultyWorkloads,
      selectedSchoolYear,
      selectedSemester
    );

    return () => {
      unsubscribe();
    };
  }, [userData, selectedSchoolYear, selectedSemester]);

  // Get ProgramChairs
  useEffect(() => {
    if (!userData || !user) return;
    if (!userData.position.toLowerCase().includes("program chairman")) return;

    const unsubscribe = getProgramChairs(
      userData.campusId,
      selectedSchoolYear,
      userData.uid,
      setFacultyWorkloads,
      selectedSemester
    );
    return () => {
      unsubscribe();
    };
  }, [selectedSchoolYear, selectedSemester, userData]);

  if (loading || !userRole || !facultyWorkloads || !user || !userData) {
    return <LoadingScreen />;
  }

  const groupByCollegeWorkloads = groupByKey(facultyWorkloads);
  const summary = toSummaryObject(facultyWorkloads);

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
  if (!userData.signature) {
    openNotification(
      "No Signature",
      "Please provide a signature on your profile"
    );
  }
  console.log(groupByCollegeWorkloads);

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
                    <SolutionOutlined /> Workloads
                  </span>
                }
                key="1"
              >
                <WorkloadsTab
                  groupByCollegeWorkloads={groupByCollegeWorkloads}
                  selectedCollege={selectedCollege}
                  setSelectedCollege={setSelectedCollege}
                  selectedSchoolYear={selectedSchoolYear}
                  setSelectedSchoolYear={setSelectedSchoolYear}
                  selectedSemester={selectedSemester}
                  setSelectedSemester={setSelectedSemester}
                  userData={userData}
                  userRole={userRole}
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <OrderedListOutlined /> Summary
                  </span>
                }
                key="2"
              >
                <SummaryTab summary={summary} />
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </WorkloadLayout>
    </>
  );
};

export default ValidateWorkloads;
