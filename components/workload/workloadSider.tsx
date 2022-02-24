import { LoadingOutlined } from "@ant-design/icons";
import { Row, Steps, Tag } from "antd";
import { Layout } from "antd";
import { useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { sumValidatorsValidation } from "utils/utils";

const { Sider } = Layout;
const { Step } = Steps;

export function StatusSider() {
  return (
    <Sider collapsible trigger={null} theme="light">
      <Row justify="center">
        {/* <Button
          type="primary"
          size="middle"
          shape="round"
          onClick={async () => {
            setVisible(true);
          }}
        >
          ADD NEW WORKLOAD
        </Button> */}
      </Row>
    </Sider>
  );
}

export function ProgressSider({ validators, validationProgress }: any) {
  const [collapsed, setCollapsed] = useState(true);
  const arrayValidators = Object.values(validators).sort(
    (a: any, b: any) => a.positionIndex - b.positionIndex
  );
  const totalValidation = sumValidatorsValidation(validators);
  return (
    <Sider
      trigger={null}
      collapsible
      onCollapse={(collapsed) => setCollapsed(collapsed)}
      collapsed={collapsed}
      theme="light"
      title="Workload Validators"
      style={{
        padding: "20px",
        overflowY: "auto",
        // height: "100vh",
        // position: "fixed",
        // left: 0,
      }}
    >
      {
        <div onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </div>
      }
      <Tag
        style={{
          margin: "10px",
        }}
        color={"processing"}
      >
        Workload Validators
      </Tag>
      <Steps direction="vertical" size="small" current={1}>
        {arrayValidators.map((validator: any, index: number) => {
          let status = "";
          let icon = null;

          if (totalValidation === -1) {
            status = "wait";
          } else if (totalValidation === index) {
            status = "process";
            icon = <LoadingOutlined />;
          } else if (totalValidation >= index + 1) {
            status = "finish";
          } else {
            status = "wait";
          }
          status = validator.validated ? "finish" : "wait";
          return (
            <Step
              key={index}
              title={`${validator.username}, ${validator.extension}`}
              status={status}
              icon={icon}
              description={validator.position}
            />
          );
        })}
      </Steps>
    </Sider>
  );
}
