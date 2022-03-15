import {
  Button,
  Collapse,
  Descriptions,
  Drawer,
  Empty,
  Input,
  Layout,
  message,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Timeline,
  Typography,
  Form,
  AutoComplete,
} from "antd";
import type { NextPage } from "next";
import { Tabs } from "antd";
import {
  ApartmentOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  FormOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import LoadingScreen from "components/layout/loadingScreen";
import { ActiveComponent } from "constants/enums/activeComponent";
import { ActiveComponentContext } from "context/activeComponentContext";
import UserProfile from "components/routes/faculty/UserProfile";
import RegisterAccount from "components/registerForm";
import WorkloadLayout from "components/layout/WorkloadLayout";
import { useAuthSession } from "utils/hooks";
import {
  getFacultyWorkloads,
  getUserProfile,
  getUsersByCampusAndRole,
  updateUserProfile,
} from "../../firebase/firestoreQueries";
import { WorkloadList } from "components/workload/WorkloadList";
import WorkloadItem from "components/routes/faculty/WorkloadItem";
import {
  getCurrentSchoolYear,
  getCurrentSemester,
  groupByKey,
} from "utils/utils";
import { SchoolYearTabSelection } from "components/schoolYearTabSelection";
import { positionKeyValue } from "constants/constants";
import { SemesterTabSelection } from "components/semesterTabSelection";

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

interface User {
  uid: string;
  displayName: string;
  email: string;
  role: string;
}

const Admin: NextPage = () => {
  const [user, loading, error, userRole, userData] = useAuthSession();
  const { activeComponent, selectedItem } = useContext(ActiveComponentContext)!;
  const [firebaseUsers, setFirebaseUsers] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // const [campusWorkloads, setCampusWorkloads] = useState<any>(null);
  const [validators, setValidators] = useState<any>(null);
  const [tabKey, setTabKey] = useState("1");
  const [facultyWorkloads, setFacultyWorkloads] = useState<any>(null);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>(
    getCurrentSemester()
  );

  const [visible, setVisible] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const [roleDrawerVisible, setRoleDrawerVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState("NONE");
  let positionIndex = -1;

  const isInvalidPosition = () => {
    positionIndex = -1;

    Object.entries(positionKeyValue).forEach(([key, value]) => {
      if (selectedPosition.toLowerCase().includes(key.toLowerCase())) {
        positionIndex = value;
      }
    });

    if (positionIndex !== -1 && selectedRole === "VALIDATOR") return false;
    if (selectedRole !== "VALIDATOR") return false;
    return true;
  };

  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setnewEmail] = useState("");
  const validEmail = new RegExp("^[A-Za-z0-9]+(.|_)+[A-Za-z0-9]+@+gmail.com$");
  const columns = [
    {
      title: "Name",
      dataIndex: "displayName",
      key: "displayName",
      render: (text: any, record: any) => {
        return (
          <>
            <a
              onClick={() => {
                setVisible(true);
                getUserProfile(record.uid).then((user) => {
                  setUserProfile(user);
                });
              }}
            >
              {text}
            </a>
          </>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Creation Time",
      dataIndex: "creationTime",
      key: "creationTime",
    },
    {
      title: "Last Sign In Time",
      dataIndex: "lastSignInTime",
      key: "lastSignInTime",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      render: (text: any, record: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setSelectedRole(record.role);
                setSelectedUser({
                  uid: record.uid,
                  displayName: record.displayName,
                  email: record.email,
                  role: record.role,
                });
                setRoleDrawerVisible(true);
              }}
            >
              {record.role}
            </Button>
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => {
        return (
          <>
            <div style={{ display: "inline-block" }}>
              <Button
                onClick={() => {
                  setSelectedUser({
                    uid: text.uid,
                    displayName: text.displayName,
                    email: text.email,
                    role: text.role,
                  });
                  setEmailModalVisible(true);
                }}
              >
                Update Email
              </Button>
            </div>
            <div style={{ display: "inline-block" }}>
              <Button
                onClick={() => {
                  setSelectedUser({
                    uid: text.uid,
                    displayName: text.displayName,
                    email: text.email,
                    role: text.role,
                  });
                  setPasswordModalVisible(true);
                }}
              >
                Update Password
              </Button>
            </div>
          </>
        );
      },
    },
  ];

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
    if (!user) return;
    getUsers().then((users) => setFirebaseUsers(users));
  }, [user]);

  // useEffect(() => {
  //   if (!userData || !user) return;
  //   getCampusWorkloads(userData.campusId, setCampusWorkloads).then(() => {});
  // }, [user, userData]);

  useEffect(() => {
    if (!userData || !user) return;
    const unsubscribe = getFacultyWorkloads(
      userData.campus,
      setFacultyWorkloads,
      selectedSchoolYear,
      selectedSemester
    );
    return () => {
      unsubscribe();
    };
  }, [userData, user, selectedSchoolYear, selectedSemester]);

  useEffect(() => {
    if (!userData) return;
    getUsersByCampusAndRole(userData.campusId, "VALIDATOR").then((docs) => {
      setValidators(() =>
        docs.sort((a: any, b: any) => a.positionIndex - b.positionIndex)
      );
    });
  }, [userData]);

  if (
    loading ||
    userRole === null ||
    firebaseUsers === null ||
    userData === null ||
    !validators ||
    facultyWorkloads === null
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
  const groupByCollegeWorkloads = groupByKey(facultyWorkloads);
  return (
    <>
      <WorkloadLayout headerTitle="Dashboard | Admin">
        <Layout style={{ width: "97%", margin: "auto", background: "#fff" }}>
          <Content style={{ overflow: "auto" }}>
            <Tabs
              defaultActiveKey={tabKey}
              onChange={(key) => setTabKey(key)}
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
                    <FormOutlined /> Register Account
                  </span>
                }
                key="1"
              >
                <RegisterAccount />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <UserOutlined /> Manage Users
                  </span>
                }
                key="2"
              >
                <Table
                  // bordered
                  // pagination={{ position: ["topRight"] }}
                  style={{ overflow: "auto" }}
                  size="small"
                  columns={columns}
                  dataSource={firebaseUsers}
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <ScheduleOutlined /> Workloads
                  </span>
                }
                key="3"
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
              <TabPane
                tab={
                  <span>
                    <ApartmentOutlined /> Workload Validation Flow
                  </span>
                }
                key="4"
              >
                <Row justify="center">
                  <Timeline>
                    {validators.map((validator: any, index: number) => {
                      return (
                        <Timeline.Item key={validator.uid}>
                          {`[${index + 1}] `}
                          {validator.username} {validator.extension},{" "}
                          {validator.position}
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                </Row>
              </TabPane>
            </Tabs>
            <Drawer
              // title="Profile"
              placement="right"
              onClose={() => setVisible(false)}
              visible={visible}
            >
              {/* {JSON.stringify(userProfile)} */}
              <Descriptions title="User Info" column={1}>
                <Descriptions.Item label="Username">
                  {userProfile?.username}
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag color={"green"}>{userProfile?.role}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Position">
                  {userProfile?.position}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {userProfile?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Baccalaureate">
                  {userProfile?.baccalaureate}
                </Descriptions.Item>
                <Descriptions.Item label="Masteral">
                  {userProfile?.masteral}
                </Descriptions.Item>
                <Descriptions.Item label="Doctorate">
                  {userProfile?.doctorate}
                </Descriptions.Item>
                <Descriptions.Item label="College">
                  {userProfile?.college}
                </Descriptions.Item>
                <Descriptions.Item label="Campus">
                  {userProfile?.campus}
                </Descriptions.Item>
              </Descriptions>
            </Drawer>

            <Drawer
              title="Update Role"
              // width={}
              onClose={() => setRoleDrawerVisible(false)}
              visible={roleDrawerVisible}
              bodyStyle={{ paddingBottom: 80 }}
              extra={
                <Space>
                  <Button onClick={() => setRoleDrawerVisible(false)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={isInvalidPosition()}
                    onClick={async () => {
                      setRoleDrawerVisible(false);
                      const res = await fetch("/api/updateRole", {
                        body: JSON.stringify({
                          uid: selectedUser?.uid,
                          role: selectedUser?.role,
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                        method: "POST",
                      });
                      console.log(res);

                      if (res.ok) {
                        await updateUserProfile(selectedUser!.uid, {
                          position: selectedPosition,
                          positionIndex,
                          role: selectedRole,
                        });
                        message.success(
                          `${selectedUser?.displayName} role has been updated`
                        );
                      }
                    }}
                    type="primary"
                  >
                    Update
                  </Button>
                </Space>
              }
            >
              <Space direction="vertical">
                <Text>Display name: {selectedUser?.displayName}</Text>
                <Text>Current email: {selectedUser?.email}</Text>
                <Select
                  // disabled={record.customClaims === "ADMIN"}
                  defaultValue={selectedUser?.role}
                  style={{ width: 120 }}
                  onChange={(newRole) => {
                    setSelectedRole(newRole);
                  }}
                >
                  <Option value="ADMIN">ADMIN</Option>
                  <Option value="FACULTY">FACULTY</Option>
                  <Option value="VALIDATOR">VALIDATOR</Option>
                  <Option value="COLLEGE_SECRETARY">COLLEGE SECRETARY</Option>
                </Select>
                {selectedRole === "VALIDATOR" ? (
                  <AutoComplete
                    filterOption={true}
                    style={{ width: 200 }}
                    onSelect={(value) => {
                      console.log(value, "value");
                    }}
                    onChange={(value) => {
                      setSelectedPosition(value);
                    }}
                    dataSource={[
                      "Program Chairman, BSCS",
                      "Dean",
                      "Executive Officer, ISUCC",
                      "Campus Registrar",
                      "President, ISUCCFA",
                      "Director, ARA",
                      "University Workload Committee",
                    ]}
                    placeholder="Position"
                  />
                ) : (
                  <></>
                )}
              </Space>
            </Drawer>

            <Drawer
              title="Update Email"
              // width={}
              onClose={() => setEmailModalVisible(false)}
              visible={emailModalVisible}
              bodyStyle={{ paddingBottom: 80 }}
              extra={
                <Space>
                  <Button onClick={() => setEmailModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={!validEmail.test(newEmail)}
                    onClick={async () => {
                      setEmailModalVisible(false);
                      const res = await fetch("/api/updateEmail", {
                        body: JSON.stringify({
                          email: newEmail,
                          uid: selectedUser?.uid,
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                        method: "POST",
                      });
                      if (res.ok) {
                        message.success(
                          `${selectedUser?.displayName} email has been updated`
                        );
                      }
                    }}
                    type="primary"
                  >
                    Update
                  </Button>
                </Space>
              }
            >
              <Space direction="vertical">
                <Text>Display name: {selectedUser?.displayName}</Text>
                <Text>Current email: {selectedUser?.email}</Text>
                <Form.Item label="New email">
                  <Input
                    placeholder="isu_user@gmail.com"
                    onChange={(value) => {
                      setnewEmail(value.currentTarget.value);
                    }}
                  />
                </Form.Item>
              </Space>
            </Drawer>
            <Drawer
              title="Update Password"
              // width={}
              onClose={() => setPasswordModalVisible(false)}
              visible={passwordModalVisible}
              bodyStyle={{ paddingBottom: 80 }}
              extra={
                <Space>
                  <Button onClick={() => setPasswordModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      password.length >= 6 && password === confirmPassword
                        ? false
                        : true
                    }
                    onClick={async () => {
                      setPasswordModalVisible(false);
                      const res = await fetch("/api/updatePassword", {
                        body: JSON.stringify({
                          password,
                          uid: selectedUser?.uid,
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                        method: "POST",
                      });
                      if (res.ok) {
                        message.success(
                          `${selectedUser?.displayName} password has been updated`
                        );
                      }
                    }}
                    type="primary"
                  >
                    Update
                  </Button>
                </Space>
              }
            >
              <Space direction="vertical">
                <Text>Display name: {selectedUser?.displayName}</Text>
                <Text>Email: {selectedUser?.email}</Text>
                <Form.Item label="Password">
                  <Input.Password
                    placeholder="input password"
                    onChange={(value) => {
                      console.log(value.currentTarget.value);
                      setPassword(value.currentTarget.value);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Confirm"
                  validateStatus={
                    password === confirmPassword ? "success" : "error"
                  }
                >
                  <Input.Password
                    placeholder="input password"
                    onChange={(value) => {
                      console.log(value.currentTarget.value);
                      setConfirmPassword(value.currentTarget.value);
                    }}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </Space>
            </Drawer>
          </Content>
        </Layout>
      </WorkloadLayout>
    </>
  );
};

async function getUsers() {
  const res = await fetch("/api/getUsers");
  const users = await res.json();
  return users;
}

export default Admin;
