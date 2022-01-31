import Head from "next/head";
import { Layout, Row, Col } from "antd";
import { Typography } from "antd";
import { LoginForm } from "components/loginForm";
import { login } from "../firebase/firebaseAuthHelper";
import { useAuthSession } from "utils/hooks";
import WorkloadLayout from "components/layout/WorkloadLayout";
import { NextPage } from "next";

const { Title } = Typography;
const { Content } = Layout;

const Login: NextPage = () => {
  const [user, loading, error] = useAuthSession();

  return (
    <>
      <Head>
        <title>Sign In | Faculty Workload</title>
        <meta
          name="description"
          content="This project was developed by BSCS Students from ISU Echague"
        />
        <link rel="icon" href="/isu-logo.ico" />
      </Head>
      {/* <Layout style={{ minHeight: "100vh" }}> */}
      {/* <WorkloadHeader user={null} /> */}

      <WorkloadLayout>
        <Content
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Row justify="center" align="middle">
            <Col>
              <Title level={1}>FACULTY WORKLOAD</Title>
            </Col>
            <Col xs={14} md={13} lg={13}>
              <LoginForm onFinish={login} />
            </Col>
          </Row>
        </Content>
      </WorkloadLayout>

      {/* <ISUFooter /> */}
      {/* </Layout> */}
    </>
  );
};

export default Login;
