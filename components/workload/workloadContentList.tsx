import { Button, Empty, Layout, Tabs } from "antd";
import { ShowModalProps } from "constants/interface/workloadProps";

import { WorkloadList } from "./WorkloadList";
import {
  OrderedListOutlined,
  PlusOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { SchoolYearTabSelection } from "./schoolYearTabSelection";
import { SummaryTab } from "./SummaryTab";
import { toSummaryObject } from "utils/utils";

const { Content } = Layout;
const { TabPane } = Tabs;

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

  const summary = toSummaryObject(workloads);
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
            <WorkloadList workloads={workloads} />
          )}
        </TabPane>
        <TabPane
          tab={
            <span>
              <OrderedListOutlined /> Summary
            </span>
          }
          key="2"
        >
          <SummaryTab summary={summary} />
        </TabPane>
      </Tabs>
    </Content>
  );
}
