import { Avatar, List, Progress, Row, Tag } from "antd";
import { ActiveComponent } from "constants/enums/activeComponent";
import { ActiveComponentContext } from "context/activeComponentContext";
import { useContext } from "react";
import styles from "styles/Home.module.css";
import { getDate } from "utils/utils";

export function WorkloadList({ workloads }: any) {
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
          paddingLeft: "2px",
          paddingRight: "2px",
        }}
        // pagination={{
        //   position: "bottom",
        //   onChange: (page) => {
        //     console.log("log:", page);
        //   },
        //   pageSize: 5,
        // }}
        renderItem={(item: any, index) => (
          <List.Item
            className={styles.listItem}
            onClick={() => {
              // router.push({
              //   pathname: `/faculty/workload/${item.id}`,
              // });
              setSelectedItem(workloads[index]);
              setActiveComponent(ActiveComponent.WorkloadItem);
            }}
          >
            <List.Item.Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={
                <a href="">
                  {item.name}, {item.doctorate}
                </a>
              }
              description={
                <>
                  <Tag color={"blue"}>{item.semester.toUpperCase()}</Tag>{" "}
                  <Tag color={"green"}>
                    School Year: {new Date(item.schoolYear[0]).getFullYear()}
                    {" - "}
                    {new Date(item.schoolYear[1]).getFullYear()}
                  </Tag>
                  <Tag color={"orange"}>{item.college}</Tag>{" "}
                  <Tag color={"orange"}>{item.campus.toUpperCase()}</Tag>{" "}
                  <div>
                    <Row style={{ marginTop: "3px" }}>
                      <Tag color={"geekblue"}>Workloads: </Tag> Undergraduate:{" "}
                      {item.undergraduateSumFTE} units
                      {" | "}Graduate: {item.graduateSumCreditUnits} units
                      {" | "} Research: {item.researchUnitsSum} units
                      {" | "} Total Faculty Workloads:{" "}
                      {item.totalFacultyWorkload}
                    </Row>
                  </div>
                </>
              }
            />
            {/* <List.Item
              extra={<WorkloadProgress workload={workloads[index]} />}
            ></List.Item> */}
            <List.Item extra={<div>{getDate(item.createdAt)}</div>}></List.Item>
          </List.Item>
        )}
      />
    </div>
  );
}

function WorkloadProgress({ workload }: any) {
  const validators = workload.validators;
  const validationProgress = workload.validationProgress;

  const len = validators.part1.length + validators.part2.length;

  const progress = Number(((validationProgress / len) * 100).toFixed(0));
  return <Progress width={35} type="circle" percent={progress} />;
}
