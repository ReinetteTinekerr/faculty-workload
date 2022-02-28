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
  Upload,
} from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { Content } from "antd/lib/layout/layout";
import { ActiveComponent } from "constants/enums/activeComponent";
import { UserProfileProps } from "constants/interface/formProps";
import { ActiveComponentContext } from "context/activeComponentContext";
import Head from "next/head";
import { createRef, useContext, useEffect, useState } from "react";
import SignaturePad from "react-signature-pad-wrapper";
import { getImageURL, uploadImage } from "../../../firebase/firestorageUtils";
import {
  getUserProfileFromCacheElseServer,
  updateUserProfile,
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
  const [signatureUpload, setSignatureUpload] = useState<any>(null);
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
    address,
  } = userData!;
  const [userSignature, setUserSignature] = useState(signature);

  const handleOk = () => {
    setIsProfileModalVisible(false);
  };

  const handleCancel = () => {
    setIsProfileModalVisible(false);
  };
  const onFinish = (values: any) => {};
  return (
    <>
      <Head>
        <title>{"Profile"}</title>
        <meta
          name="description"
          content="This project was developed by BSCS Students from ISU Echague"
        />

        <link rel="icon" href="/isu-logo.ico" />
      </Head>
      <Layout
        style={{
          height: "100vh",
          margin: "auto",
        }}
      >
        <Content style={{ width: "70%", margin: "auto", background: "#fff" }}>
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
              <Button
                key="1"
                type="default"
                onClick={() => setIsSignatureModalVisible(true)}
              >
                SIGNATURE
              </Button>,
              <Button
                key="2"
                type="primary"
                onClick={() => setIsProfileModalVisible(true)}
              >
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
            <Descriptions.Item label="Address">{address}</Descriptions.Item>
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
            <Descriptions.Item label="Department">
              {department}
            </Descriptions.Item>
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
                    console.log(signatureUpload);
                    if (
                      signatureUpload !== null &&
                      signatureUpload.length > 0
                    ) {
                      setIsSignatureSaving(true);
                      let reader = new FileReader();
                      reader.readAsDataURL(signatureUpload[0].originFileObj);
                      reader.onload = async (e) => {
                        const dataUrl = reader.result as string;
                        try {
                          await uploadImage(dataUrl, uid);
                          message.success("Success");

                          setUserSignature(
                            userSignature.split("&token=")[0] +
                              "&token=" +
                              Date.now().toString()
                          );
                          setSignatureUpload(null);
                          // await getUserProfileFromCacheElseServer(uid, true);
                        } catch (error) {
                          message.success("Something went wrong");
                        }
                      };
                      setIsSignatureSaving(false);
                      setEditSignature(false);
                      return;
                    }
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
                {" | "}
                <Upload
                  accept=".png, .pjg"
                  maxCount={1}
                  beforeUpload={(file) => {
                    return false;
                  }}
                  onChange={({ fileList }) => {
                    if (
                      fileList.length <= 0 ||
                      fileList[0].originFileObj === undefined
                    )
                      return;

                    setSignatureUpload(fileList);
                  }}
                >
                  <Button
                    disabled={!editSignature}
                    key={"upload"}
                    onClick={() => {
                      // setEditSignature(true);
                      // signaturePadRef.current?.clear();
                    }}
                  >
                    UPLOAD
                  </Button>
                </Upload>
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
              <Button
                key="back"
                onClick={() => setIsProfileModalVisible(false)}
              >
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
                    console.log("test", values);
                    await updateUserProfile(uid, values);
                    setIsProfileModalVisible(false);
                    message.success("Profile updated");
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
              layout={"vertical"}
              initialValues={{
                username: userData!.username,
                baccalaureate,
                masteral,
                doctorate,
                college,
                campus,
                address: address === undefined ? "" : address,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Name"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Required Username", // type: "array",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Address" name="address">
                <Input />
              </Form.Item>
              <Form.Item
                label="Baccalaureate Degree"
                name="baccalaureate"
                rules={[
                  {
                    required: true,
                    message: "Required Baccalaureate Degree", // type: "array",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Campus" name="campus">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="masteral"
                label="Masteral Degree"
                rules={[
                  {
                    required: true,
                    message: "Missing masteral degree", // type: "array",
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
                  <Option value=" ">NONE</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="doctorate"
                label="Doctorate Degree"
                rules={[
                  {
                    required: true,
                    message: "Doctorate Degree is missing", // type: "array",
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
                  <Option value=" ">NONE</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="college"
                label="College"
                rules={[
                  {
                    required: true,
                    message: "College is missing",
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
                  <Option
                    title="College of Computing Studies, Information and Communication Technology"
                    value="CCSICT"
                  >
                    CCSICT
                  </Option>
                  <Option title="College of Arts and Sciences" value="CAS">
                    CAS
                  </Option>
                  <Option title="College of Engineering" value="COE">
                    CE
                  </Option>
                  <Option
                    title="College of Business, Accountancy and Public Administration"
                    value="CBAPA"
                  >
                    CBAPA
                  </Option>
                  <Option title="College of Agriculture" value="CA">
                    CA
                  </Option>
                  <Option title="School of Veterinary Medicine" value="SVM">
                    SVM
                  </Option>
                  <Option
                    title="College of Criminal Justice Education"
                    value="CCJE"
                  >
                    CCJE
                  </Option>
                  <Option title="College of Nursing" value="CN">
                    CN
                  </Option>
                  <Option title="Institute of Fisheries" value="IF">
                    IF
                  </Option>
                  <Option title="Central Graduate School" value="CGS">
                    CGS
                  </Option>
                  <Option title="College of Education" value="CoEd">
                    CoEd
                  </Option>
                  <Option value=" ">NONE</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </>
  );
};
export default UserProfile;
