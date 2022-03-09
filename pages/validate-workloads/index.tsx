import Layout, { Content } from "antd/lib/layout/layout";
import LoadingScreen from "components/layout/loadingScreen";
import WorkloadLayout from "components/layout/WorkloadLayout";
import UserProfile from "components/routes/faculty/UserProfile";
import { ActiveComponent } from "constants/enums/activeComponent";
import { ActiveComponentContext } from "context/activeComponentContext";
import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { useAuthSession } from "utils/hooks";
import { Tabs, Collapse, Typography, Empty } from "antd";
import {
  AuditOutlined,
  FormOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import WorkloadItem from "components/routes/faculty/WorkloadItem";

import { WorkloadList } from "components/workload/WorkloadList";
import {
  getFacultyWorkloads,
  getProgramChairs,
  getValidatedWorkloads,
} from "../../firebase/firestoreQueries";
import Head from "next/head";
import {
  getCurrentSchoolYear,
  getCurrentSemester,
  groupByKey,
  openNotification,
} from "utils/utils";
import { SchoolYearTabSelection } from "components/schoolYearTabSelection";
import { SemesterTabSelection } from "components/semesterTabSelection";
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Title } = Typography;

const ValidateWorkloads: NextPage = () => {
  const [user, loading, error, userRole, userData] = useAuthSession();
  const [facultyWorkloads, setFacultyWorkloads] = useState<any>(null);
  const [validatedWorkloads, setValidatedWorkloads] = useState<any>(null);
  const { activeComponent, setActiveComponent, setSelectedItem, selectedItem } =
    useContext(ActiveComponentContext)!;
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>(
    getCurrentSemester()
  );

  useEffect(() => {
    const storedSchoolYear = localStorage.getItem("schoolYear");
    const storedCollege = localStorage.getItem("college");
    // const storedSemester = localStorage.getItem("semester");
    setSelectedSchoolYear(
      !storedSchoolYear ? getCurrentSchoolYear() : storedSchoolYear
    );
    setSelectedCollege(!storedCollege ? "" : storedCollege);
    // setSelectedSemester(!storedSemester ? "" : storedSemester);
  }, []);

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

  console.log(loading, facultyWorkloads, user);

  const groupByCollegeWorkloads = groupByKey(facultyWorkloads);

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
            <Tabs
              defaultActiveKey="1"
              onChange={() => {}}
              centered
              tabBarExtraContent={{
                right: (
                  <>
                    <SchoolYearTabSelection
                      selectedSchoolYear={selectedSchoolYear}
                      setSelectedSchoolYear={setSelectedSchoolYear}
                    />
                    <SemesterTabSelection
                      selectedSemester={selectedSemester}
                      setSelectedSemester={setSelectedSemester}
                    />
                  </>
                ),
              }}
            >
              <TabPane
                tab={
                  <span>
                    <SolutionOutlined /> Workloads
                  </span>
                }
                key="1"
              >
                {Object.keys(groupByCollegeWorkloads).length > 0 ? (
                  <Collapse
                    style={{ width: "90%", margin: "auto" }}
                    defaultActiveKey={[selectedCollege]}
                    accordion
                    onChange={(value) => {
                      console.log("collapse", value);
                      setSelectedCollege(value ? value.toString() : "");
                      localStorage.setItem(
                        "college",
                        value ? value.toString() : ""
                      );
                    }}
                  >
                    {Object.entries(groupByCollegeWorkloads).map(
                      ([key, value]) => {
                        return (
                          <Panel
                            header={<Title level={5}>{key}</Title>}
                            extra={`Total: ${value.length}`}
                            key={key}
                          >
                            <WorkloadList
                              userRole={userRole}
                              userPositionIndex={userData.positionIndex}
                              workloads={value}
                              selectedSemester={selectedSemester}
                              setSelectedSemester={setSelectedSemester}
                            />
                          </Panel>
                        );
                      }
                    )}
                  </Collapse>
                ) : (
                  <Empty></Empty>
                )}
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </WorkloadLayout>
    </>
  );
};

export default ValidateWorkloads;
