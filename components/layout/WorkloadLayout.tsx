import { Layout } from "antd";
import WorkloadHeader from "components/workload/workloadHeader";
import type { NextPage } from "next";
import Head from "next/head";
import { ISUFooter } from "./footer";

interface ChildrenProps {
  children: React.ReactChildren | React.ReactChild;
  headerTitle?: string;
}

const WorkloadLayout: NextPage<ChildrenProps> = ({ children, headerTitle }) => {
  return (
    <>
      <Head>
        <title>{headerTitle}</title>
        <meta
          name="description"
          content="This project was developed by BSCS Students from ISU Echague"
        />

        <link rel="icon" href="/isu-logo.ico" />
      </Head>
      <Layout style={{ height: "100vh" }}>
        <WorkloadHeader />
        <>
          {children}
          <ISUFooter />
        </>
      </Layout>
    </>
  );
};

export default WorkloadLayout;
