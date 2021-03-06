import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  message,
  AutoComplete,
} from "antd";
import {
  kAdminRole,
  kCollegeSecretaryRole,
  kFacultyRole,
  kValidatorRole,
  positionKeyValue,
} from "constants/constants";
import { useState } from "react";

const { Option } = Select;

export interface RegisterFormProps {
  email: string;
  username: string;
  baccalaureate?: string;
  masteral?: string;
  doctorate?: string;
  department?: string;
  college: string;
  campus: string;
  role: string;
  position: string;
  password: string;
  extension: string;
}

const isInvalidPosition = (selectedPosition: string, selectedRole: string) => {
  let positionIndex = -1;

  Object.entries(positionKeyValue).forEach(([key, value]) => {
    if (selectedPosition.toLowerCase().includes(key.toLowerCase())) {
      positionIndex = value;
    }
  });

  if (positionIndex !== -1 && selectedRole === kValidatorRole) return false;
  if (selectedRole !== kValidatorRole && selectedRole !== kAdminRole)
    return false;
  return true;
};

export default function RegisterAccount() {
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterFormProps) => {
    if (isInvalidPosition(values.position, values.role)) {
      message.error("Invalid position");
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/register`, {
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const data = await res.json();

    setLoading(false);
    if (res.ok) {
      message.success(`${values.username} has been registered!`);
    } else {
      message.error(data.error.message);
    }
    console.log(values);
  };

  return (
    <>
      <Form
        form={form}
        name="register"
        size="small"
        // form={form}
        // labelCol={{ span: 4 }}
        layout={"vertical"}
        // wrapperCol={{ span: 16 }}
        initialValues={{
          password: "isuworkload123",
          position: "NONE",
          baccalaureate: "",
          masteral: " ",
          doctorate: " ",
          department: "",
          extension: "",
        }}
        onFinish={onFinish}
        autoComplete="off"
        style={{
          maxWidth: "700px",
          margin: "auto",
          border: "1px solid black",
          borderColor: "rgb(198,198,198)",
          padding: "10px",
          overflow: "auto",
        }}
      >
        <Row justify="space-around">
          <Col>
            <Form.Item
              label="Full name"
              name="username"
              rules={[{ required: true, message: "Please put a name" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Extension"
              name="extension"
              // rules={[{ required: true, message: "Please put a name" }]}
            >
              <Select
                showSearch
                style={{
                  width: 180,
                }}
                placeholder="Ph. D."
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
                <Option value="Ph. D.">Ph. D.</Option>
                <Option value="MIT">MIT</Option>
                <Option value="DPA">DPA</Option>
                <Option value="DIT">DIT</Option>
                <Option value=" ">NONE</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-around">
          <Col>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  // type: "email",
                  message: "Email must end with @gmail.com",
                  required: true,
                  pattern: new RegExp(
                    "^[A-Za-z0-9]+(.|_)+[A-Za-z0-9]+@+gmail.com$"
                  ),
                },
              ]}
            >
              <Input placeholder="whoami@gmail.com" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input showCount />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-around">
          <Col>
            <Form.Item label="Baccalaureate Degree" name="baccalaureate">
              <Input placeholder="BSCS" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="masteral" label="Masteral Degree" rules={[{}]}>
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
          </Col>
        </Row>
        <Row justify="space-around">
          <Col>
            <Form.Item
              name="doctorate"
              label="Doctorate Degree"
              rules={[
                {
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
                <Option value=" ">NONE</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="department" label="Department" rules={[{}]}>
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
          </Col>
        </Row>
        <Row justify="space-around">
          <Col>
            <Form.Item
              name="college"
              label="College"
              rules={[
                {
                  required: true,
                  message: "College field is required",
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
                <Option value="NONE">NONE</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Campus"
              name="campus"
              rules={[
                {
                  required: true,
                  message: "Campus field is required",
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
                <Option value="Echague Campus">Echague Campus</Option>
                <Option value="Cauayan Campus">Cauyan Campus</Option>
                <Option value="Cabagan Campus">Cabagan Campus</Option>
                <Option value="Ilagan Campus">Ilagan Campus</Option>
                <Option value="Roxas Campus">Roxas Campus</Option>
                <Option value="Angadanan Campus">Angadanan Campus</Option>
                <Option value="Jones Campus">Jones Campus</Option>
                <Option value="San Mateo Campus">San Mateo Campus</Option>
                <Option value="San Mariano Campus">San Mariano Campus</Option>
                <Option value="Santiago Campus">
                  Santiago Extension Campus
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-around">
          <Col>
            <Form.Item
              label="Role"
              name="role"
              rules={[
                {
                  required: true,
                  message: "Role field is required",
                },
              ]}
            >
              <Select
                // allowClear
                onDeselect={(role) => {
                  if (role === kValidatorRole) {
                    setIsItemSelected(false);
                  }
                }}
                onSelect={(role: any) => {
                  if (role === kValidatorRole) {
                    setIsItemSelected(true);
                  } else {
                    setIsItemSelected(false);
                    form.setFieldsValue({ position: "NONE" });
                  }
                }}
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
                <Option value={kFacultyRole}>FACULTY</Option>
                <Option value={kValidatorRole}>WORKLOAD VALIDATOR</Option>
                <Option value={kAdminRole}>ADMIN</Option>
                <Option value={kCollegeSecretaryRole}>COLLEGE SECRETARY</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Position"
              name="position"
              rules={[
                {
                  required: true,
                  message: "Position field is required",
                },
              ]}
            >
              <AutoComplete
                disabled={!isItemSelected}
                filterOption={true}
                style={{ width: 200 }}
                onSelect={(value) => {}}
                dataSource={[
                  "Program Chairman, BSCS",
                  "Dean",
                  "Executive Officer, ISUCC",
                  "Campus Registrar",
                  "President, ISUCCFA",
                  "Director, ARA",
                  "University Workload Committee",
                ]}
                placeholder="Position"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Form.Item>
            <Button
              // style={{ padding: "5px", height: "40px" }}
              size="middle"
              type="primary"
              shape="round"
              htmlType="submit"
              disabled={loading}
            >
              Create
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
}
