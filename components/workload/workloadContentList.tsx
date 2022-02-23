import {
  Button,
  Empty,
  Layout,
  Select,
  Tabs,
  Collapse,
  Typography,
} from "antd";
import { ShowModalProps } from "constants/interface/workloadProps";

import { WorkloadList } from "./WorkloadList";
import { PlusOutlined, SolutionOutlined } from "@ant-design/icons";
import { getCurrentSchoolYear, getDecrementedSchoolYear } from "utils/utils";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;
const { Text, Title } = Typography;

export function WorkloadContentList({
  setVisible,
  workloads,
  selectedSchoolYear,
  setSelectedSchoolYear,
}: ShowModalProps) {
  const style = {
    margin: "0px 10px",
    background: "#fff",
    overflow: "auto",
  };
  const schoolYear = getCurrentSchoolYear();
  const firstSemWorkloads = workloads.filter(
    (workload: any) => workload.workload.semester === "First Semester"
  );

  const secondSemWorkloads = workloads.filter(
    (workload: any) => workload.workload.semester === "Second Semester"
  );
  const summerWorkloads = workloads.filter(
    (workload: any) => workload.workload.semester === "Summer"
  );
  return (
    <Content style={style}>
      <Tabs
        defaultActiveKey={"1"}
        onChange={(key) => {}}
        centered
        size="small"
        tabBarExtraContent={{
          left: (
            <Button
              type="primary"
              shape="round"
              onClick={() => setVisible(true)}
            >
              <PlusOutlined /> NEW WORKLOAD
            </Button>
          ),
          right: (
            <>
              <Text strong> School Year:</Text>{" "}
              <Select
                showSearch
                onSelect={(value) => {
                  console.log(value);
                  setSelectedSchoolYear(value);
                  localStorage.setItem("schoolYear", value.toString());
                }}
                style={{ width: "120px" }}
                placeholder="Type to select"
                optionFilterProp="children"
                defaultValue={
                  !selectedSchoolYear ? schoolYear : selectedSchoolYear
                }
                filterOption={(input, option: any) => {
                  return (
                    option?.children
                      ?.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                filterSort={(optionA, optionB) =>
                  optionB.children
                    .toLowerCase()
                    .localeCompare(optionA.children.toLowerCase())
                }
              >
                {[...new Array(10).keys()].map((_: any, i: number) => {
                  return (
                    <Option
                      key={i}
                      value={getDecrementedSchoolYear(schoolYear, i)}
                    >
                      {getDecrementedSchoolYear(schoolYear, i)}
                    </Option>
                  );
                })}
              </Select>
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
        >
          {workloads.length <= 0 ? (
            <Empty style={{ paddingTop: "50px" }}>
              <Button
                size="middle"
                shape="round"
                onClick={async () => {
                  setVisible(true);
                }}
              >
                <PlusOutlined /> ADD NEW WORKLOAD
              </Button>
            </Empty>
          ) : (
            // <div>{JSON.stringify(formData, null, 2)}</div>
            <Collapse
              style={{ width: "90%", margin: "auto" }}
              defaultActiveKey={["1", "2", "3"]}
              onChange={() => {
                console.log("collapse");
              }}
            >
              <Panel
                header={<Title level={5}>First Semester</Title>}
                extra={`Total: ${firstSemWorkloads.length}`}
                key="1"
              >
                <WorkloadList workloads={firstSemWorkloads} />
              </Panel>
              <Panel
                header={<Title level={5}>Second Semester</Title>}
                extra={`Total: ${secondSemWorkloads.length}`}
                key="2"
              >
                <WorkloadList workloads={secondSemWorkloads} />
              </Panel>
              <Panel
                header={<Title level={5}>Mid Year</Title>}
                key="3"
                extra={`Total: ${summerWorkloads.length}`}
              >
                <WorkloadList workloads={summerWorkloads} />
              </Panel>
            </Collapse>
          )}
        </TabPane>
        {/* <TabPane
          tab={
            <span>
              <FormOutlined /> Drafts
            </span>
          }
          key="1"
        >
          {workloads.length <= 0 ? (
            <Empty style={{ paddingTop: "50px" }}>
              <Button
                size="middle"
                shape="round"
                onClick={async () => {
                  setVisible(true);
                }}
              >
                <PlusOutlined /> ADD NEW WORKLOAD
              </Button>
            </Empty>
          ) : (
            // <div>{JSON.stringify(formData, null, 2)}</div>
            <WorkloadList workloads={workloads} />
          )}
        </TabPane> */}
        {/* <TabPane
          tab={
            <span>
              <ReloadOutlined /> In Progress
            </span>
          }
          key="2"
        >
          {workloadsInProgress?.length <= 0 || workloadsInProgress === null ? (
            <Empty style={{ paddingTop: "50px" }}></Empty>
          ) : (
            // <div>{JSON.stringify(formData, null, 2)}</div>
            <WorkloadList workloads={workloadsInProgress} />
          )}
        </TabPane>
        <TabPane
          tab={
            <span>
              <CheckOutlined /> Approved
            </span>
          }
          key="3"
        >
          {approvedWorkloads?.length <= 0 || approvedWorkloads === null ? (
            <Empty style={{ paddingTop: "50px" }}></Empty>
          ) : (
            // <div>{JSON.stringify(formData, null, 2)}</div>
            <WorkloadList workloads={approvedWorkloads} />
          )}
        </TabPane> */}
      </Tabs>
    </Content>
  );
}
