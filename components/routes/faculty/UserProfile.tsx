import {
  Badge,
  Button,
  Descriptions,
  Form,
  Input,
  Layout,
  Modal,
  PageHeader,
  Select,
  Space,
  Tag,
} from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { Content } from "antd/lib/layout/layout";
import { ActiveComponent } from "constants/enums/activeComponent";
import { UserProfileProps } from "constants/interface/formProps";
import { ActiveComponentContext } from "context/activeComponentContext";
import { useContext, useState } from "react";

const { Option } = Select;

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  console.log(userData);

  const { setActiveComponent } = useContext(ActiveComponentContext)!;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const {
    baccalaureate,
    campus,
    college,
    department,
    doctorate,
    email,
    masteral,
    position,
    role,
    username,
  } = userData!;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };
  return (
    <Layout
      style={{
        height: "100vh",
        margin: "auto",
      }}
    >
      <Content style={{ width: "60%", margin: "auto", background: "#fff" }}>
        <PageHeader
          className="site-page-header"
          title={
            <>
              <Avatar style={{ background: "#f56a00" }} size={"large"}>
                {username[0]}
              </Avatar>
            </>
          }
          subTitle={
            <Space>
              {username}
              <Tag color={"gold"}>{role}</Tag>
            </Space>
          }
          onBack={() => {
            setActiveComponent(ActiveComponent.WorkloadIndex);
          }}
          extra={[
            <Button key="1" type="primary" onClick={showModal}>
              EDIT
            </Button>,
          ]}
        />
        <Descriptions
          title={<>User Info</>}
          style={{ margin: "20px", marginLeft: "50px" }}
          column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="Name">{username}</Descriptions.Item>
          <Descriptions.Item label="Email">{email}</Descriptions.Item>
          <Descriptions.Item label="Address">.</Descriptions.Item>
          <Descriptions.Item label="Position">
            <Badge color={"lime"} /> {position}
          </Descriptions.Item>
          <Descriptions.Item label="Baccalaureate Degree">
            {baccalaureate === undefined ? "" : baccalaureate}
          </Descriptions.Item>
          <Descriptions.Item label="Masteral Degree">
            {masteral}
          </Descriptions.Item>
          <Descriptions.Item label="Doctorate Degree">
            {doctorate}
          </Descriptions.Item>
          <Descriptions.Item label="Campus">
            <Badge color={"geekblue"} /> {campus}
          </Descriptions.Item>
          <Descriptions.Item label="College">{college}</Descriptions.Item>
          <Descriptions.Item label="Department">{department}</Descriptions.Item>
        </Descriptions>

        <Modal
          title="Edit Profile"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              CANCEL
            </Button>,
            <Button
              key={"save"}
              htmlType="submit"
              type="primary"
              loading={loading}
              onClick={async () => {
                try {
                  const values = await form.validateFields();
                  console.log(values);
                } catch (error) {}
                // setLoading(true);
                // const { success } = await onCheck();
                // setLoading(false);
                // if (success) {
                //   setVisible(false);
                // }
              }}
            >
              SAVE
            </Button>,
          ]}
        >
          <Form
            name="profile"
            form={form}
            // labelCol={{ span: 4 }}
            layout={"vertical"}
            // wrapperCol={{ span: 16 }}
            initialValues={{ username: userData!.username }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item label="Name" name="username">
              <Input />
            </Form.Item>

            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
            <Form.Item label="Baccalaureate Degree" name="baccalaureate">
              <Input />
            </Form.Item>
            <Form.Item
              name="masteral"
              label="Masteral Degree"
              rules={[
                {
                  required: true,
                  message: "Please select your favourite colors!", // type: "array",
                },
              ]}
            >
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                placeholder="Type to select"
                optionFilterProp="children"
                filterOption={(input, option: any) => {
                  return (
                    option?.children
                      ?.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                <Option value="MIT">MIT</Option>
                <Option value="">NONE</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="doctorate"
              label="Doctorate Degree"
              rules={[
                {
                  required: true,
                  message: "Please select your favourite colors!", // type: "array",
                },
              ]}
            >
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                placeholder="Type to select"
                optionFilterProp="children"
                filterOption={(input, option: any) => {
                  return (
                    option?.children
                      ?.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                <Option value="DIT">DIT</Option>
                <Option value="">NONE</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="college"
              label="College"
              rules={[
                {
                  required: true,
                  message: "Please select your favourite colors!",
                },
              ]}
            >
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                placeholder="Type to select"
                optionFilterProp="children"
                filterOption={(input, option: any) => {
                  return (
                    option?.children
                      ?.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                <Option value="CCSICT">CCSICT</Option>
                <Option value="CAS">CAS</Option>
                <Option value="COE">COE</Option>
                <Option value="CBAPA">CBAPA</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Campus" name="campus">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="college"
              label="College"
              rules={[
                {
                  required: true,
                  message: "Please select your favourite colors!",
                },
              ]}
            >
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                placeholder="Type to select"
                optionFilterProp="children"
                filterOption={(input, option: any) => {
                  return (
                    option?.children
                      ?.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                <Option value="CCSICT">CCSICT</Option>
                <Option value="CAS">CAS</Option>
                <Option value="COE">COE</Option>
                <Option value="CBAPA">CBAPA</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};
export default UserProfile;
