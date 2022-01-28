import { Button, Empty, Layout, Pagination, Tabs } from "antd";
import { ShowModalProps } from "constants/interface/workloadProps";

import styles from "styles/Home.module.css";
import { ActiveComponent } from "constants/enums/activeComponent";
import { ActiveComponentContext } from "context/activeComponentContext";
import { getDate } from "utils/utils";
import { WorkloadList } from "./WorkloadList";
import { CheckOutlined, FormOutlined, ReloadOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { TabPane } = Tabs;

export function WorkloadContentList({
  setVisible,
  workloads,
  workloadsInProgress,
  approvedWorkloads,
}: ShowModalProps) {
  // console.log("content list", workloads);
  // const userWorkloads = workloads
  //   .map((workload: any) => {
  //     return workload.workload;
  //   })
  //   .sort((a: any, b: any) => b.createdAt - a.createdAt);
  // const { setActiveComponent, setSelectedItem } = useContext(
  //   ActiveComponentContext
  // )!;

  const style = {
    margin: "0px 10px",
    background: "#fff",
    overflow: "auto",
  };

  return (
    <Content style={style}>
      {/* <PageHeader
        style={{
          padding: "0px",
          paddingLeft: "10px",
        }}
        title="Your Workloads"
        extra={[
          <Button
            key="1"
            type="primary"
            shape="round"
            onClick={() => setVisible(true)}
          >
            ADD NEW WORKLOAD
          </Button>,
        ]}
      /> */}
      <Tabs
        defaultActiveKey="1"
        onChange={() => {}}
        centered
        size="small"
        tabBarExtraContent={{
          left: (
            <Button
              type="primary"
              shape="round"
              onClick={() => setVisible(true)}
            >
              NEW WORKLOAD
            </Button>
          ),
          right: (
            <Pagination
              defaultCurrent={1}
              total={50}
              simple={true}
              size="small"
            />
          ),
        }}
      >
        <TabPane
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
                ADD NEW WORKLOAD
              </Button>
            </Empty>
          ) : (
            // <div>{JSON.stringify(formData, null, 2)}</div>
            <WorkloadList workloads={workloads} />
          )}
        </TabPane>
        <TabPane
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
        </TabPane>
      </Tabs>
    </Content>
  );
}
