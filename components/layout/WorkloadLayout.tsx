import { Layout } from "antd";
import WorkloadHeader from "components/workload/workloadHeader";
import type { NextPage } from "next";
import { ISUFooter } from "./footer";

interface ChildrenProps {
  children: React.ReactChildren | React.ReactChild;
}

const WorkloadLayout: NextPage<ChildrenProps> = ({ children }) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <WorkloadHeader />
      {children}
      <ISUFooter />
    </Layout>
  );
};

export default WorkloadLayout;
