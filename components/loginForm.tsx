import { Form, Input, Button, Row, Col, message } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";

export function LoginForm(props: any) {
  const [loading, setLoading] = useState(false);
  return (
    <Form
      name="login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={async (values) => {
        setLoading(true);
        const { error, message: errorMsg } = await props.onFinish(values);
        setLoading(false);

        if (error) {
          switch (errorMsg.code) {
            case "auth/too-many-requests":
              message.error("Too many request");
              break;
            case "auth/invalid-password":
              message.error("Invalid password");
              break;
            case "auth/invalid-email":
              message.error("Invalid email");
              break;
            case "auth/wrong-password":
              message.error("Incorrect password");
              break;
            default:
              message.error(errorMsg.code, 3);
              break;
          }
        }
      }}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input size="large" prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined />}
          placeholder="Password"
        />
      </Form.Item>
      <Row justify="center">
        {/* <Col>
          <Form.Item>
            <Link href={""}>
              <a>Forgot password</a>
            </Link>
          </Form.Item>
        </Col> */}
        <Col>
          <Form.Item name="submit">
            <Button
              disabled={loading}
              type="primary"
              shape="round"
              htmlType="submit"
              className="login-form-button"
            >
              {loading ? (
                <>
                  {"Signing In  "}
                  <LoadingOutlined />
                </>
              ) : (
                " Sign In"
              )}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
