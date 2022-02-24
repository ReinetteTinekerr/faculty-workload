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
  getValidatedWorkloads,
} from "../../firebase/firestoreQueries";
import Head from "next/head";
import { getCurrentSchoolYear } from "utils/utils";
import { SchoolYearTabSelection } from "components/schoolYearTabSelection";
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
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  useEffect(() => {
    const storedSchoolYear = localStorage.getItem("schoolYear");
    const storedCollege = localStorage.getItem("college");
    const storedSemester = localStorage.getItem("semester");
    setSelectedSchoolYear(
      !storedSchoolYear ? getCurrentSchoolYear() : storedSchoolYear
    );
    setSelectedCollege(!storedCollege ? "" : storedCollege);
    setSelectedSemester(!storedSemester ? "" : storedSemester);
  }, []);

  useEffect(() => {
    if (!userData || !user) return;
    getFacultyWorkloads(
      userData.campus,
      userData.positionIndex,
      setFacultyWorkloads,
      selectedSchoolYear
    );
  }, [userData, user, selectedSchoolYear]);

  // useEffect(() => {
  //   if (!userData || !user) return;
  //   const unsubscribe = getValidatedWorkloads(
  //     userData.campusId,
  //     userData.positionIndex,
  //     setValidatedWorkloads
  //   );
  // }, [userData, user]);

  if (loading || !userRole || !facultyWorkloads || !user) {
    return <LoadingScreen />;
  }

  const groupByCollegeWorkloads = groupByKey(facultyWorkloads);
  console.log(groupByCollegeWorkloads);

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
                  <SchoolYearTabSelection
                    selectedSchoolYear={selectedSchoolYear}
                    setSelectedSchoolYear={setSelectedSchoolYear}
                  />
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

                {/* <WorkloadList workloads={facultyWorkloads} /> */}
              </TabPane>
              {/* <TabPane
                tab={
                  <span>
                    <FormOutlined /> Pending
                  </span>
                }
                key="2"
              >
                <WorkloadList workloads={facultyWorkloads} />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <AuditOutlined /> Validated
                  </span>
                }
                key="3"
              >
                <WorkloadList workloads={validatedWorkloads} />
              </TabPane> */}
            </Tabs>
          </Content>
        </Layout>
      </WorkloadLayout>
    </>
  );
};

export default ValidateWorkloads;

function groupByKey(array: [any]): { string: [any] } {
  return array.reduce((obj, item) => {
    obj[item.workload.college] = obj[item.workload.college] || [];
    obj[item.workload.college].push(item);
    return obj;
    //   if(obj[key] === undefined) return hash;
    //   return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
  }, {});
}
