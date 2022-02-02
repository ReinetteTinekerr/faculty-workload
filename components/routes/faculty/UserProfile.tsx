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
  Image,
  Tag,
  message,
} from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { Content } from "antd/lib/layout/layout";
import { ActiveComponent } from "constants/enums/activeComponent";
import { UserProfileProps } from "constants/interface/formProps";
import { ActiveComponentContext } from "context/activeComponentContext";
import { createRef, useContext, useEffect, useState } from "react";
import SignaturePad from "react-signature-pad-wrapper";
import { getImageURL, uploadImage } from "../../../firebase/firestorageUtils";
import {
  getUserProfileFromCacheElseServer,
  updateUserSignature,
} from "../../../firebase/firestoreQueries";

const { Option } = Select;

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  const { setActiveComponent } = useContext(ActiveComponentContext)!;
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isSignatureModalVisible, setIsSignatureModalVisible] = useState(false);
  const [editSignature, setEditSignature] = useState(false);
  const [isSignatureSaving, setIsSignatureSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const signaturePadRef = createRef<SignaturePad>();
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
    uid,
    signature,
  } = userData!;
  const [userSignature, setUserSignature] = useState(signature);

  const showProfileModal = () => {
    setIsProfileModalVisible(true);
  };
  const showSignatureModal = () => {
    setIsSignatureModalVisible(true);
  };

  const handleOk = () => {
    setIsProfileModalVisible(false);
  };

  const handleCancel = () => {
    setIsProfileModalVisible(false);
  };
  const onFinish = (values: any) => {};
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
            <Button key="1" type="default" onClick={showSignatureModal}>
              SIGNATURE
            </Button>,
            <Button key="2" type="primary" onClick={showProfileModal}>
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
          width={500}
          title="Signature"
          visible={isSignatureModalVisible}
          onCancel={() => setIsSignatureModalVisible(false)}
          footer={[
            <>
              <Button
                key={"back"}
                onClick={() => {
                  setEditSignature(false);
                  setIsSignatureModalVisible(false);
                }}
              >
                CANCEL
              </Button>
              <Button
                key={"clear"}
                onClick={() => {
                  setEditSignature(true);
                  signaturePadRef.current?.clear();
                }}
              >
                CLEAR
              </Button>
              <Button
                key={"edit"}
                type="default"
                onClick={() => {
                  setEditSignature(true);
                }}
              >
                EDIT
              </Button>
              <Button
                disabled={isSignatureSaving || !editSignature}
                key={"ok"}
                type="primary"
                onClick={async () => {
                  if (signaturePadRef.current?.isEmpty()) {
                    message.error("Signature must not be empty!");
                    setEditSignature(false);
                    return;
                  }
                  setIsSignatureSaving(true);
                  const image = signaturePadRef.current?.toDataURL();
                  if (image === undefined) return;
                  await uploadImage(image, uid);
                  const url = await getImageURL(uid);
                  if (url === null) return;
                  const urlWithoutToken = url.split("&token")[0];

                  if (signature === undefined) {
                    await updateUserSignature(uid, urlWithoutToken);
                    await getUserProfileFromCacheElseServer(uid, true);
                  }

                  setUserSignature(url);
                  console.log(url, "url", userSignature);

                  setIsSignatureSaving(false);
                  setEditSignature(false);
                }}
              >
                {isSignatureSaving ? "SAVING..." : "SAVE"}
              </Button>
            </>,
          ]}
        >
          {!editSignature ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                width={300}
                alt="Signature"
                src={userSignature}
                // placeholder={true}
              />
            </div>
          ) : (
            <SignaturePad
              ref={signaturePadRef}
              options={{
                backgroundColor: "rgb(0,0,0,0)",
                minWidth: 1,
                maxWidth: 2,
                penColor: "rgb(0,0,0)",
              }}
            />
          )}
        </Modal>
        <Modal
          title="Edit Profile"
          visible={isProfileModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={() => setIsProfileModalVisible(false)}>
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
