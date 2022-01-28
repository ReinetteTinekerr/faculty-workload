import Head from "next/head";
import { Layout, Row, Col } from "antd";
import { Typography } from "antd";
import { LoginForm } from "components/loginForm";
import { login } from "../firebase/firebaseAuthHelper";
import { useAuthSession } from "utils/hooks";
import WorkloadLayout from "components/layout/WorkloadLayout";

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const [user, loading, error] = useAuthSession();

  return (
    <>
      <Head>
        <title>Sign In | Faculty Workload</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
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
