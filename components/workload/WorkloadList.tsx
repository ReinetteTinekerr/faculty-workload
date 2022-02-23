import { Avatar, List, Progress, Row, Typography, Tag, Badge } from "antd";
import { ActiveComponent } from "constants/enums/activeComponent";
import { ActiveComponentContext } from "context/activeComponentContext";
import { useContext } from "react";
import styles from "styles/Home.module.css";
import { getDate } from "utils/utils";

const { Text } = Typography;

export function WorkloadList({ workloads }: any) {
  //main
  const { setActiveComponent, setSelectedItem } = useContext(
    ActiveComponentContext
  )!;

  const userWorkloads = workloads.map((workload: any) => {
    return workload.workload;
  });
  // .sort((a: any, b: any) => b.createdAt - a.createdAt);
  return (
    <div style={{ overflow: "auto" }}>
      <List
        // bordered
        size="small"
        itemLayout="horizontal"
        dataSource={userWorkloads}
        style={{
          paddingLeft: "12px",
          paddingRight: "12px",
        }}
        renderItem={(item: any, index) => (
          <RibbonBadge isApproved={workloads[index].approved}>
            <List.Item
              className={styles.listItem}
              onClick={() => {
                setSelectedItem(workloads[index]);
                setActiveComponent(ActiveComponent.WorkloadItem);
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={{ background: "#f56a00" }}>
                    {item.name[0]}
                  </Avatar>
                }
                title={
                  <a>
                    <span style={{ paddingRight: "15px" }}>
                      {item.name}, {item.doctorate}
                    </span>
                    <Tag color={"default"}>
                      TOTAL FACULTY WORKLOAD:{" "}
                      <Text strong>{item.totalFacultyWorkload}</Text>
                    </Tag>
                  </a>
                }
                description={
                  <>
                    {/* <Tag color={"default"}>
                    TOTAL FACULTY WORKLOAD:{" "}
                    <Text strong>{item.totalFacultyWorkload}</Text>
                  </Tag>
                  <Tag color={"default"}>
                    EXCESS FACULTY WORKLOAD:{" "}
                    <Text strong>{item.excessFacultyWorkload}</Text>
                  </Tag> */}
                  </>
                }
              />
              <List.Item
                extra={<WorkloadProgress workload={workloads[index]} />}
              ></List.Item>
              <List.Item
                extra={<Text strong>{getDate(item.createdAt)}</Text>}
              ></List.Item>
            </List.Item>
          </RibbonBadge>
        )}
      />
    </div>
  );
}

function WorkloadProgress({ workload }: any) {
  const validatorsLength = Object.values(workload.validators).length;
  const validationProgress = workload.validationProgress - 1;

  const progress = Number(
    ((validationProgress / validatorsLength) * 100).toFixed(0)
  );

  return <Progress width={25} type="circle" percent={progress} />;
}

function RibbonBadge({ isApproved, children }: any) {
  if (isApproved) {
    return (
      <Badge.Ribbon
        style={{
          marginTop: "-8px",
        }}
        text="Approved"
        color={"green"}
      >
        {children}
      </Badge.Ribbon>
    );
  }
  return children;
}
