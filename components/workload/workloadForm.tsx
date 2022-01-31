import type { NextPage } from "next";

import React, { useContext, useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  DatePicker,
  Typography,
  Divider,
  InputNumber,
  Upload,
  message,
  Card,
  Tag,
  Tooltip,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { WorkloadFormContext } from "./workloadModal";

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Props {
  name: string;
}

interface DataItemFieldProps {
  restField: any;
  span: number;
  name1: number;
  name2?: string;
  message: string;
  label: string;
  placeholder?: string;
  style?: any;
  inputType?: string;
  disabled?: boolean;
  onChange?(value: any): void;
  value?: string | number;
  required?: boolean;
  key?: number;
  min?: number;
  max?: number;
}

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  beforeUpload: (file: any) => {
    if (file.type !== "image/png") {
      message.error(`${file.name} is not a png file`);
    }
    return file.type === "image/png" ? true : Upload.LIST_IGNORE;
  },
  onChange(info: any) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const residences = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

function DataItemField({
  label,
  message,
  name1,
  name2,
  placeholder,
  restField,
  span,
  style,
  inputType,
  disabled,
  onChange,
  value,
  required,
  min,
  max,
}: DataItemFieldProps) {
  return (
    <Col span={span} style={{ paddingRight: "5px" }}>
      <Form.Item
        {...restField}
        label={label}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        name={[name1, name2]}
        rules={[
          {
            required: required === undefined ? true : required,
            message: message,
          },
        ]}
      >
        <Input
          placeholder={placeholder}
          style={style}
          type={inputType}
          disabled={disabled}
          onChange={onChange}
          value={value}
          min={min}
          max={max}
        />
      </Form.Item>
    </Col>
  );
}

function GraduateFormList() {
  return (
    <Row justify="center">
      {" "}
      <Form.List name="graduate">
        {(fields, { add, remove }) => (
          <div>
            {fields.map(({ key, name, ...restField }) => (
              <Row
                key={key}
                style={{
                  overflow: "hidden",
                }}
              >
                <DataItemField
                  name1={name}
                  span={3}
                  restField={restField}
                  label="Course No."
                  name2={"courseNo"}
                  message="Missing course no."
                  placeholder="DIT 401"
                  style={{ textTransform: "uppercase" }}
                />
                <DataItemField
                  name1={name}
                  span={5}
                  restField={restField}
                  label="Course Description"
                  name2={"courseDescription"}
                  message="Missing course description"
                  placeholder="Advanced Software Engineering"
                  style={{ textTransform: "capitalize" }}
                />
                <DataItemField
                  name1={name}
                  span={4}
                  restField={restField}
                  label="Curricular Program and Year Level"
                  name2={"curricularProg"}
                  message="Missing field"
                  placeholder="DIT 1"
                  style={{ textTransform: "uppercase" }}
                />
                <Col span={3} style={{ paddingRight: "5px" }}>
                  <Form.Item
                    {...restField}
                    label={"No. of Students"}
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    name={[name, "totalStudents"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing no. of students",
                      },
                    ]}
                  >
                    <InputNumber min={0} max={100} placeholder={"9"} />
                  </Form.Item>
                </Col>
                <Col span={3} style={{ paddingRight: "5px" }}>
                  <Form.Item
                    {...restField}
                    label={"Units"}
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    name={[name, "units"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing units",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={10} placeholder={"3"} />
                  </Form.Item>
                </Col>

                <Col span={3} style={{ paddingRight: "5px" }}>
                  <Form.Item
                    {...restField}
                    label={"Contact Hrs/wk LEC"}
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    name={[name, "lecContactHrs"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing lecture contact hrs/wk",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={5} placeholder={"3"} />
                  </Form.Item>
                </Col>

                <Col span={3} style={{ paddingRight: "5px" }}>
                  <Form.Item
                    {...restField}
                    label={"Contact Hrs/wk LAB"}
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    name={[name, "labContactHrs"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing lab contact hrs/wk",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={5} placeholder={"3"} />
                  </Form.Item>
                </Col>

                <Col span={3} style={{ paddingRight: "5px" }}>
                  <Form.Item
                    {...restField}
                    label={"Credit Units Lec"}
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    name={[name, "lecCreditUnits"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing course lecture credit units",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={5} placeholder={"2"} />
                  </Form.Item>
                </Col>

                <Col span={3} style={{ paddingRight: "5px" }}>
                  <Form.Item
                    {...restField}
                    label={"Credit Units Lab"}
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    name={[name, "labCreditUnits"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing lab credit units",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={5} placeholder={"1"} />
                  </Form.Item>
                </Col>

                <MinusCircleOutlined
                  style={{
                    margin: "10px",
                    // marginTop: "10px",
                    // marginRight: "20px",
                    fontSize: "18px",
                    color: "red",
                  }}
                  onClick={() => remove(name)}
                />
                <Divider />
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </Row>
  );
}

function UnderGraduateFormList() {
  // const [labHoursList, setLabHoursList] = useState<number[]>([]);
  // const [lecHoursList, setLecHoursList] = useState<number[]>([]);
  // const [totalFTEList, setTotalFTEList] = useState<number[]>([]);
  // const [key, setKey] = useState<number>(0);
  const form = useContext(WorkloadFormContext);

  // useEffect(() => {}, [labHoursList, lecHoursList]);

  return (
    <Row justify="center">
      {" "}
      <Form.List name="undergraduate">
        {(fields, { add, remove }) => (
          <div style={{}}>
            {fields.map(({ key, name, ...restField }) => (
              <Row
                key={key}
                style={{
                  overflow: "hidden",
                }}
              >
                <DataItemField
                  name1={name}
                  span={3}
                  restField={restField}
                  label="SUBJECT/ COURSE CODE"
                  name2={"courseCode"}
                  message="Missing course no."
                  placeholder="CS 411"
                  style={{ textTransform: "uppercase" }}
                  inputType="text"
                />
                <DataItemField
                  name1={name}
                  span={5}
                  restField={restField}
                  label="DESCRIPTIVE TITLE"
                  name2={"descriptiveTitle"}
                  message="Missing course description"
                  placeholder="CS Thesis Writing 2"
                  // style={{ textTransform: "capitalize" }}
                  inputType="text"
                />
                <Col span={4}>
                  <Form.Item
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    name={[name, "subjectLabel"]}
                    label="REGULAR/ UNPROG SUBJECT"
                    rules={[
                      {
                        required: true,
                        message: "Missing field",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      style={{
                        width: 150,
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
                      <Option value="REGULAR">REGULAR</Option>
                      <Option value="UNPROG">UNPROG</Option>
                    </Select>
                  </Form.Item>
                </Col>

                {/* <DataItemField
                  name1={name}
                  span={4}
                  restField={restField}
                  label="REGULAR/ UNPROG SUBJECT"
                  name2={"subjectLabel"}
                  message="Missing field"
                  placeholder="REGULAR"
                  style={{ textTransform: "uppercase" }}
                  inputType="text"
                /> */}
                <DataItemField
                  name1={name}
                  span={3}
                  restField={restField}
                  label="PROGRAM YEAR LEVEL"
                  name2={"programYearLevel"}
                  message="Missing no. of students"
                  placeholder="BSCS 4A"
                  style={{ textTransform: "uppercase" }}
                  inputType="text"
                />
                <Col span={3} style={{ paddingRight: "5px" }}>
                  <Form.Item
                    {...restField}
                    label={"UNITS"}
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    name={[name, "units"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing units",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={10} placeholder={"3"} />
                  </Form.Item>
                </Col>

                <Col span={3} style={{ paddingRight: "5px" }}>
                  <Form.Item
                    {...restField}
                    label={"NO. OF HOURS LEC"}
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    name={[name, "lecHours"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing NO. OF HOURS LEC",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={10} placeholder={"2"} />
                  </Form.Item>
                </Col>
                <Col span={3} style={{ paddingRight: "5px" }}>
                  <Form.Item
                    {...restField}
                    label={"NO. OF HOURS LAB"}
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    name={[name, "labHours"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing NO. OF HOURS LAB",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={10} placeholder={"3"} />
                  </Form.Item>
                </Col>

                <DataItemField
                  name1={name}
                  span={3}
                  restField={restField}
                  label="SCHEDULE"
                  name2={"schedule"}
                  message="Missing SCHEDULE"
                  placeholder="MON 5-10 WED 7-10"
                  style={{ textTransform: "uppercase" }}
                  inputType="text"
                />

                <Col span={3} style={{ paddingRight: "5px" }}>
                  <Form.Item
                    {...restField}
                    label={"NO. OF STUDENTS"}
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    name={[name, "totalStudents"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing NO. OF STUDENTS",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={100} placeholder={"45"} />
                  </Form.Item>
                </Col>

                <DataItemField
                  name1={name}
                  span={3}
                  restField={restField}
                  label="ROOMS"
                  name2={"rooms"}
                  message="Missing ROOMS"
                  placeholder="ITRM 104/ RMBLAB 104"
                  style={{ textTransform: "uppercase" }}
                  inputType="text"
                />
                <DataItemField
                  name1={name}
                  span={3}
                  restField={restField}
                  label="LEC FTE"
                  // name2={"lecFTE"}
                  name2="lecHours"
                  message="Missing FTE LEC"
                  style={{ textTransform: "uppercase" }}
                  inputType="number"
                  disabled={true}
                  required={false}
                />
                <DataItemField
                  name1={name}
                  name2="labHours"
                  // name2={"labFTE"}
                  span={3}
                  restField={restField}
                  label="LAB FTE"
                  message="Missing FTE LAB"
                  style={{ textTransform: "uppercase" }}
                  inputType="number"
                  required={false}
                  disabled={true}
                  // value={"FDSFSD"}
                />
                {/* <DataItemField
                  name1={name}
                  name2={"totalFTE"}
                  span={3}
                  restField={restField}
                  label="FTE TOTAL"
                  message="Missing TOTAL FTE"
                  // placeholder="5"
                  style={{ textTransform: "uppercase" }}
                  inputType="number"
                  disabled={true}
                  placeholder={totalFTEList[name].toString()}
                  value={totalFTEList[name]}
                  required={false}
                /> */}

                <MinusCircleOutlined
                  style={{
                    margin: "10px",
                    // marginTop: "10px",
                    // marginRight: "20px",
                    fontSize: "18px",
                    color: "red",
                  }}
                  onClick={() => remove(name)}
                />
                <Divider />
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add();
                }}
                block
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </Row>
  );
}

const WorkloadForm: NextPage = () => {
  return (
    <>
      <PersonalInfo />
      <Undergraduate />
      <Graduate />
      <Research />
      <Extension />
      <Administration />
      {/* <Row justify="end">
        <Text strong>
          Total Faculty Workload: <Tag color="blue">XX</Tag>
        </Text>
      </Row>
      <Row justify="end">
        <Text strong>
          Excess Faculty Workload: <Tag color="blue">XX</Tag>
        </Text>
      </Row> */}
    </>
  );
};

function PersonalInfo() {
  return (
    <Row justify="center">
      <Col span={10}>
        <Form.Item
          name="semester"
          label="Semester/ Summer"
          rules={[
            {
              required: true,
              message: "Please select your semester",
            },
          ]}
        >
          <Select
            placeholder="Select semester"
            style={{
              width: 200,
            }}
          >
            <Option value="First Semester">FIRST SEMESTER</Option>
            <Option value="Second Semester">SECOND SEMESTER</Option>
            <Option value="Summer">SUMMER</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
              whitespace: true,
            },
          ]}
        >
          <Input
            disabled
            style={{
              width: 200,
              textTransform: "capitalize",
            }}
          />
        </Form.Item>

        <Form.Item
          name="baccalaureate"
          label="Baccalaureate Degree"
          rules={[
            {
              required: true,
              message: "Please select your favourite colors!", // type: "array",
            },
          ]}
        >
          <Select
            disabled
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
            <Option value="BSCS">BSCS</Option>
            <Option value="BSIT">BSIT</Option>
            <Option value="BSIS">BSIS</Option>
          </Select>
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
            disabled
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
      </Col>
      <Col>
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
            disabled
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
          name="schoolYear"
          label="School Year"
          rules={[
            {
              required: true,
              message: "Please select school year",
              type: "array",
            },
          ]}
        >
          <RangePicker
            style={{
              width: 200,
            }}
            picker="year"
          />
        </Form.Item>

        <Form.Item
          name="campus"
          label="Campus"
          rules={[
            {
              required: true,
              message: "Please select your favourite colors!",
            },
          ]}
        >
          <Select
            showSearch
            disabled
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
            <Option value="Santiago Campus">Santiago Extension Campus</Option>
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
            maxTagCount={11}
            maxTagPlaceholder={[
              "fs",
              "fs",
              "fs",
              "afw",
              "rwre",
              "rwerew",
              "a",
              "ab",
              "b",
              "r",
              "re",
              "q",
              "43",
            ]}
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
            <Option title="College of Criminal Justice Education" value="CCJE">
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
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
}

function Undergraduate() {
  return (
    <Row>
      <Divider orientation="left" orientationMargin="0">
        A. Undergraduate
      </Divider>
      <UnderGraduateFormList />
    </Row>
  );
}

function Graduate() {
  return (
    <Row>
      <Divider orientation="left" orientationMargin="0">
        B. Graduate
      </Divider>
      <GraduateFormList />
    </Row>
  );
}

function Research() {
  return (
    <Row>
      <Divider orientation="left" orientationMargin="0">
        C. Research
      </Divider>
      <ResearchAndProductionInputs name="research" />
    </Row>
  );
}

function Extension() {
  return (
    <Row>
      <Divider orientation="left" orientationMargin="0">
        D. Extension/ Production
      </Divider>
      <ResearchAndProductionInputs name="production" />
    </Row>
  );
}

function Administration() {
  const props = {
    beforeUpload: (file: any) => {
      const isPNG = file.type.indexOf("image/") === 0;
      if (!isPNG) {
        message.error(`${file.name} is not an image`);
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must smaller than 5MB!");
      }
      return isPNG && isLt5M;
    },
    onChange: (info: any) => {
      console.log(info.fileList);
    },
  };
  return (
    <Row>
      <Divider orientation="left" orientationMargin="0">
        E. Administration
      </Divider>
      <Form.Item
        label="Position"
        name="position"
        rules={[
          {
            required: true,
            message: "Please fill in your position",
          },
        ]}
      >
        <Input
          style={{
            width: 150,
            textTransform: "capitalize",
          }}
        />
      </Form.Item>
      <Form.Item label="Proof">
        <Upload {...props} listType="picture" maxCount={1}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
    </Row>
  );
}

const ResearchAndProductionInputs: React.FC<Props> = ({ name }) => {
  // const onFinish = (values: any) => {
  //   console.log("Received values of form:", values);
  // };
  const gridStyle = {
    width: "25%",
    textAlign: "center",
  };

  return (
    <>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row align="middle" key={key}>
                <Row>
                  <Card size="default">
                    <Row>
                      <Col span={18}>
                        <Form.Item
                          {...restField}
                          name={[name, "title"]}
                          rules={[{ required: true, message: "Missing title" }]}
                          label="Title"
                        >
                          <Input placeholder="" style={{ width: "150px" }} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "date"]}
                          label="Duration"
                          rules={[{ required: true, message: "Missing date" }]}
                        >
                          <RangePicker style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "role"]}
                          rules={[{ required: true, message: "Missing role" }]}
                          label="Role"
                        >
                          <Input placeholder="" style={{ width: "150px" }} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "units"]}
                          rules={[
                            { required: true, message: "Missing credit units" },
                          ]}
                          label="Credit Units"
                        >
                          <InputNumber min={0} max={20} defaultValue={0} />
                        </Form.Item>
                        <Form.Item>
                          <Upload {...props}>
                            <Button
                              icon={<UploadOutlined />}
                              style={{ marginLeft: "70px" }}
                            >
                              Click to Upload
                            </Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Row>
                <MinusCircleOutlined
                  style={{
                    margin: "10px",
                    // marginTop: "10px",
                    // marginRight: "20px",
                    fontSize: "18px",
                    color: "red",
                  }}
                  onClick={() => remove(name)}
                />
              </Row>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Add field
            </Button>
          </>
        )}
      </Form.List>
      {/* <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item> */}
    </>
  );
};

export default WorkloadForm;
