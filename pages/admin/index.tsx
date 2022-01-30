import {
  Button,
  Descriptions,
  Drawer,
  Layout,
  message,
  Popconfirm,
  Row,
  Select,
  Table,
  Tag,
  Timeline,
} from "antd";
import type { NextPage } from "next";
import Head from "next/head";
import { Tabs } from "antd";
import {
  ApartmentOutlined,
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
  getCampusWorkloads,
  getUserProfile,
  getUsersByCampusAndRole,
} from "../../firebase/firestoreQueries";
import { WorkloadList } from "components/workload/WorkloadList";
import WorkloadItem from "components/routes/faculty/WorkloadItem";

const { TabPane } = Tabs;

const { Content } = Layout;
const { Option } = Select;

const Admin: NextPage = () => {
  const [user, loading, error, userRole, userData] = useAuthSession();
  const { activeComponent, selectedItem } = useContext(ActiveComponentContext)!;
  const [firebaseUsers, setFirebaseUsers] = useState<any>(null);
  const [campusWorkloads, setCampusWorkloads] = useState<any>(null);
  const [validators, setValidators] = useState<any>(null);
  const [tabKey, setTabKey] = useState("1");

  useEffect(() => {
    if (!user) return;
    getUsers().then((users) => setFirebaseUsers(users));
  }, [user]);

  useEffect(() => {
    if (!userData || !user) return;
    getCampusWorkloads(userData.campusId, setCampusWorkloads).then(() => {});
  }, [user, userData]);

  useEffect(() => {
    if (!userData) return;
    getUsersByCampusAndRole(userData.campusId, "VALIDATOR").then((docs) => {
      console.log(docs, "docs");

      setValidators(() =>
        docs.sort((a: any, b: any) => a.positionIndex - b.positionIndex)
      );
    });
  }, [userData]);

  if (
    loading ||
    userRole === null ||
    firebaseUsers === null ||
    userData === null
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
        <title>ISU Workload Admin</title>
        <meta
          name="description"
          content="This project was developed by BSCS Students from ISU Echague"
        />
        <link rel="icon" href="/isu-logo.ico" />
      </Head>

      <WorkloadLayout headerTitle="Dashboard | Admin">
        <Layout style={{ width: "90%", margin: "auto", background: "#fff" }}>
          <Content style={{ overflow: "auto" }}>
            <Tabs
              defaultActiveKey={tabKey}
              onChange={(key) => setTabKey(key)}
              centered
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
                  style={{ overflow: "auto" }}
                  size="small"
                  columns={columns}
                  dataSource={firebaseUsers}
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <ScheduleOutlined /> Submissions
                  </span>
                }
                key="3"
              >
                <WorkloadList workloads={campusWorkloads} />
                {/* Content of Tab Pane 3 */}
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

const columns = [
  {
    title: "Name",
    dataIndex: "displayName",
    key: "displayName",
    render: (text: any, record: any) => {
      const [visible, setVisible] = useState(false);
      const [userProfile, setUserProfile] = useState<any>();
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
          <Drawer
            // title="Profile"
            placement="right"
            onClose={() => setVisible(false)}
            visible={visible}
          >
            {/* {JSON.stringify(userProfile)} */}
            <Descriptions title="User Info" column={1}>
              <Descriptions.Item label="UserName">
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
    render: (text: any, record: any, index: any) => (
      <Select
        defaultValue={record.role}
        style={{ width: 120 }}
        onChange={(newRole) => {
          setTimeout(async () => {
            const res = await fetch("/api/updateRole", {
              body: JSON.stringify({ role: newRole, uid: record.uid }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            });

            if (res.ok) {
              message.success(
                `${record.displayName}'s role was set to ${newRole}`
              );
            }
          }, 1000);
        }}
      >
        <Option value="ADMIN">ADMIN</Option>
        <Option value="FACULTY">FACULTY</Option>
        <Option value="VALIDATOR">VALIDATOR</Option>
      </Select>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (text: any, record: any) => (
      <div>
        <Popconfirm
          title="Are you sure you want to delete this user permanently?"
          okText="Yes"
          cancelText="No"
          onConfirm={async () => {
            const res = await fetch("/api/deleteUser", {
              body: JSON.stringify({ uid: record.uid }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            });
            if (res.ok) {
              message.success(`${record.displayName} has been deleted`);
            }
          }}
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      </div>
    ),
  },
];
