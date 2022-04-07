import {
  Avatar,
  List,
  Progress,
  Row,
  Typography,
  Tag,
  Badge,
  Collapse,
} from "antd";
import { kAdminRole, kValidatorRole } from "constants/constants";
import { ActiveComponent } from "constants/enums/activeComponent";
import { ActiveComponentContext } from "context/activeComponentContext";
import { useContext, useEffect, useState } from "react";
import styles from "styles/Home.module.css";
import { getDate, sumValidatorsValidation } from "utils/utils";

const { Text, Title } = Typography;
const { Panel } = Collapse;

export function WorkloadList({ workloads, userRole, userPositionIndex }: any) {
  const { setActiveComponent, setSelectedItem } = useContext(
    ActiveComponentContext
  )!;

  // const [selectedSemester, setSelectedSemester] = useState("");
  // useEffect(() => {
  //   const storedSemester = localStorage.getItem("semester");
  //   setSelectedSemester(storedSemester ? storedSemester : "First Semester");
  // }, []);

  const sem = {
    sem1: "First Semester",
    sem2: "Second Semester",
    summer: "Summer",
  };
  const firstSemWorkloads = workloads.filter(
    (workload: any) => workload.workload.semester === sem.sem1
  );

  const secondSemWorkloads = workloads.filter(
    (workload: any) => workload.workload.semester === sem.sem2
  );
  const summerWorkloads = workloads.filter(
    (workload: any) => workload.workload.semester === sem.summer
  );

  const workloadsPerSemester = {
    "First Semester": firstSemWorkloads,
    "Second Semester": secondSemWorkloads,
    Summer: summerWorkloads,
  };

  return (
    <>
      <Collapse
        style={{ width: "90%", margin: "auto" }}
        defaultActiveKey={["First Semester", "Second Semester", "Summer"]}
        accordion={userRole === kValidatorRole ? true : false}
        onChange={(value) => {
          console.log("collapse", value);
          // if (setSelectedSemester) {
          //   setSelectedSemester(value ? value.toString() : "");
          //   localStorage.setItem("semester", value ? value.toString() : "");
          // }
        }}
      >
        {Object.entries(workloadsPerSemester).map(([key, value]) => {
          return (
            <>
              {value.length > 0 ? (
                <>
                  {userRole === kValidatorRole || userRole === kAdminRole ? (
                    <WorkloadListBuilder
                      userRole={userRole}
                      userPositionIndex={userPositionIndex}
                      setActiveComponent={setActiveComponent}
                      setSelectedItem={setSelectedItem}
                      value={value}
                    />
                  ) : (
                    <Panel
                      header={<Title level={5}>{key}</Title>}
                      // extra={`Total: ${value.length}`}
                      key={key}
                    >
                      <WorkloadListBuilder
                        userRole={userRole}
                        userPositionIndex={userPositionIndex}
                        setActiveComponent={setActiveComponent}
                        setSelectedItem={setSelectedItem}
                        value={value}
                      />
                    </Panel>
                  )}
                </>
              ) : (
                <></>
              )}
            </>
          );
        })}
      </Collapse>
    </>
  );
}

function WorkloadListBuilder({
  value,
  userRole,
  userPositionIndex,
  setSelectedItem,
  setActiveComponent,
}: any) {
  return (
    <div
      style={{
        overflow: "auto",
      }}
    >
      <List
        bordered
        size="small"
        itemLayout="horizontal"
        dataSource={value}
        style={{
          paddingLeft: "12px",
          paddingRight: "12px",
        }}
        renderItem={(item: any, index) => (
          <RibbonBadge // validationProgress={item.workload.validationProgress}
            isSubmitted={item.submitted}
            userRole={userRole}
            userPositionIndex={userPositionIndex}
            validators={item.validators}
            isApproved={item.approved}
          >
            <List.Item
              className={styles.listItem}
              onClick={() => {
                setSelectedItem(item);
                setActiveComponent(ActiveComponent.WorkloadItem);
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      background: "#f56a00",
                    }}
                  >
                    {item.workload.name[0]}
                  </Avatar>
                }
                title={
                  <a>
                    <span
                      style={{
                        paddingRight: "15px",
                      }}
                    >
                      {item.workload.name}, {item.workload.doctorate}
                    </span>
                    <Tag color={"default"}>
                      TOTAL FACULTY WORKLOAD:{" "}
                      <Text strong>{item.workload.totalFacultyWorkload}</Text>
                    </Tag>
                  </a>
                }
                description={<></>}
              />
              <List.Item
                extra={<WorkloadProgress workload={item} />}
              ></List.Item>
              <List.Item
                extra={<Text strong>{getDate(item.workload.createdAt)}</Text>}
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
  // const validationProgress = workload.validationProgress - 1;
  const totalValidation = sumValidatorsValidation(workload.validators);

  const progress = Number(
    ((totalValidation / validatorsLength) * 100).toFixed(0)
  );

  return <Progress width={25} type="circle" percent={progress} />;
}

function RibbonBadge({
  userRole,
  userPositionIndex,
  isSubmitted,
  isApproved,
  children,
  validators,
}: any) {
  // console.log(userPositionIndex, validationProgress);
  // console.log(Object.values(validators));
  const totalValidation = sumValidatorsValidation(validators);

  // if (userRole === "VALIDATOR" && validationProgress == userPositionIndex&& )

  if (isApproved) {
    return (
      <Badge.Ribbon
        style={{
          marginTop: "-8px",
        }}
        text="Accepted"
        color={"green"}
      >
        {children}
      </Badge.Ribbon>
    );
  }

  if (totalValidation >= userPositionIndex && userRole === kValidatorRole) {
    return (
      <Badge.Ribbon
        style={{
          marginTop: "-8px",
        }}
        text="Approved"
        color={"blue"}
      >
        {children}
      </Badge.Ribbon>
    );
  }
  if (totalValidation === userPositionIndex - 1 && isSubmitted) {
    return (
      <Badge.Ribbon
        style={{
          marginTop: "-8px",
        }}
        text="Pending"
        color={"volcano"}
      >
        {children}
      </Badge.Ribbon>
    );
  }
  if (userRole !== kValidatorRole && isSubmitted) {
    return (
      <Badge.Ribbon
        style={{
          marginTop: "-8px",
        }}
        text="Submitted"
        color={"cyan"}
      >
        {children}
      </Badge.Ribbon>
    );
  }
  return children;
}
