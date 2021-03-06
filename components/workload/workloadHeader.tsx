import Image from "next/image";
import { Col, Dropdown, Layout, Menu, Row, Tabs, Tag } from "antd";
import Title from "antd/lib/typography/Title";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { logout } from "../../firebase/firebaseAuthService";
import React, { useContext } from "react";
import { ActiveComponentContext } from "context/activeComponentContext";
import { ActiveComponent } from "constants/enums/activeComponent";
import Link from "next/link";
import { useAuthSession } from "utils/hooks";
import { useRouter } from "next/router";
import { UnsubscribeWorkloadContext } from "context/unsubscribeWorkloadContext";
import {
  kAdminRole,
  kCollegeSecretaryRole,
  kFacultyRole,
  kValidatorRole,
} from "constants/constants";
const { TabPane } = Tabs;
const { Header } = Layout;

type tabRouteOptions = {
  [key: string]: string;
};

function WorkloadHeader() {
  const [user, loading, error, userRole, userData] = useAuthSession();

  const router = useRouter();
  const tabRoutes: tabRouteOptions = {
    "/faculty": "3",
    "/validate-workloads": "2",
    "/admin": "1",
  };
  const selectedTab = tabRoutes[router.pathname];

  const { setActiveComponent } = useContext(ActiveComponentContext)!;
  const menu = (
    <Menu>
      <Menu.Item
        icon={<UserOutlined />}
        key="setting:1"
        onClick={() => setActiveComponent(ActiveComponent.Profile)}
      >
        Profile
      </Menu.Item>
      <Menu.Item
        icon={<LogoutOutlined />}
        danger={true}
        key="setting:2"
        onClick={() => {
          logout();
        }}
      >
        Sign Out
      </Menu.Item>
    </Menu>
  );
  return (
    <Header
      style={{
        background: "#fff",
        borderBottom: "1px solid",
        borderColor: "rgb(198,198,198)",
        paddingLeft: "15px",
        paddingRight: "15px",
      }}
    >
      <Row align="middle" justify="start">
        <Col span={14}>
          <Row align="middle" justify="start">
            <Col style={{ marginTop: "5px" }}>
              <Image
                alt="ISU Logo"
                className=""
                src={"/isu-logo.png"}
                width={50}
                height={50}
              />
            </Col>
            <Col xs={15} lg={15}>
              <Title
                style={{
                  paddingLeft: 10,
                }}
                level={4}
              >
                FACULTY WORKLOAD {"  "}
                {user ? (
                  <Tag color="default">{userData?.campus.split(" ")[0]}</Tag>
                ) : null}
              </Title>
            </Col>
          </Row>
        </Col>
        {user && router.pathname !== "/login" ? (
          <Col span={10}>
            <Row justify="end">
              <Tabs
                animated={{ inkBar: false, tabPane: true }}
                defaultActiveKey={selectedTab}
                onChange={() => {}}
                size="small"
                tabBarGutter={20}
              >
                <TabPane
                  style={{ marginLeft: "0px" }}
                  tab={
                    userRole?.includes(kAdminRole) ? (
                      <Link href={"/admin"}>Admin</Link>
                    ) : (
                      <></>
                    )
                  }
                  key="1"
                ></TabPane>
                <TabPane
                  style={{ margin: "0px" }}
                  tab={
                    userRole?.includes(kValidatorRole) ? (
                      <Link href={"/validate-workloads"}>
                        Validate Workloads
                      </Link>
                    ) : (
                      <></>
                    )
                  }
                  key="2"
                ></TabPane>
                <TabPane
                  tab={
                    userRole?.includes(kFacultyRole) ||
                    userRole?.includes(kValidatorRole) ||
                    userRole?.includes(kCollegeSecretaryRole) ? (
                      <Link href={"/faculty"}>Faculty Workloads</Link>
                    ) : (
                      <></>
                    )
                  }
                  key="3"
                ></TabPane>
                <TabPane
                  disabled
                  tab={
                    <>
                      <Dropdown overlay={menu} trigger={["click"]}>
                        <Title level={5}>
                          <a onClick={(e) => e.preventDefault()}>
                            {firstNameCharLastName(userData?.username)}{" "}
                            <DownOutlined />
                          </a>
                        </Title>
                      </Dropdown>
                    </>
                  }
                  key="4"
                ></TabPane>
              </Tabs>
            </Row>
          </Col>
        ) : (
          <></>
        )}
      </Row>
    </Header>
  );
}

function firstNameCharLastName(fullname: string | null) {
  if (!fullname) return "";
  const nameArr = fullname.split(" ");

  if (nameArr.length >= 2) {
    return nameArr[0][0] + "." + nameArr[nameArr.length - 1];
  }
  return nameArr[0];
}

export default WorkloadHeader;
