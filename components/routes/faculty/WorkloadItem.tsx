import {
  Button,
  Col,
  Layout,
  PageHeader,
  Popconfirm,
  Row,
  Table,
  Image,
  message,
} from "antd";
import Text from "antd/lib/typography/Text";
import WorkloadHeader from "components/workload/workloadHeader";
import { graduateColumns, undergraduateColumns } from "data/data";

import styles from "styles/ID.module.css";
import ReactToPrint from "react-to-print";
import { Component, useContext, useEffect, useRef, useState } from "react";
import { WorkloadDataProps } from "constants/interface/formProps";
import { getDate, getSchoolYear, toTitleCase } from "utils/utils";
import moment from "moment";
import { ActiveComponentContext } from "context/activeComponentContext";
import { ActiveComponent } from "constants/enums/activeComponent";
import { ProgressSider } from "components/workload/workloadSider";
import {
  deleteWorkload,
  submitWorkload,
  unsubmitWorkload,
} from "../../../firebase/firestoreQueries";
import { useAuthSession } from "utils/hooks";
import LoadingScreen from "components/layout/loadingScreen";
// import { Image } from "next/image";

const { Content } = Layout;

interface ResearchAndProductionProps {
  title: string;
  from: string | undefined;
  to: string;
  role: string;
  creditUnits: string | number;
  count: string | number;
}
interface UserInfoProps {
  label: string | undefined;
  data: string | undefined;
  labelSpan: number | undefined;
  dataSpan: number | undefined;
}

interface NameTitleSignatureProps {
  name: string;
  title: string;
  signature?: any;
  span?: number;
  tag?: string;
  validated?: boolean;
  owner?: boolean;
}

function ResearchFormFields({
  title,
  from,
  to,
  role,
  creditUnits,
  count,
}: ResearchAndProductionProps) {
  return (
    <Row align="bottom">
      <Col span={9}>
        <div
          style={{
            borderBottom: "1px solid black",
            textTransform: "capitalize",
          }}
        >
          {count}
          {title}
        </div>
      </Col>
      <Col span={3}></Col>
      <Col span={2}>
        <div
          style={{
            borderBottom: "1px solid black",
          }}
        >
          {from}
        </div>
      </Col>
      <Col span={1}></Col>
      <Col span={2}>
        <div
          style={{
            borderBottom: "1px solid black",
          }}
        >
          {to}
        </div>
      </Col>
      <Col span={1}></Col>
      <Col span={3}>
        <div
          style={{
            borderBottom: "1px solid black",
            textTransform: "capitalize",
          }}
        >
          {role}
        </div>
      </Col>
      <Col span={1}></Col>
      <Col span={2}>
        <div
          style={{
            borderBottom: "1px solid black",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {creditUnits}
        </div>
      </Col>
    </Row>
  );
}

function HorizontalLineInfo({
  label,
  total,
}: {
  label: string;
  total: string | number | undefined;
}) {
  return (
    <Row
      style={{
        marginBottom: "4px",
      }}
    >
      <Col style={{ fontWeight: "bold" }} span={4}>
        {label}
      </Col>
      <Col
        span={18}
        style={{
          borderBottom: "1px dotted",
        }}
      ></Col>
      <Col
        span={2}
        style={{
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {total === undefined ? 0 : total}
      </Col>
    </Row>
  );
}

function ResearchAndProductionHeader() {
  return (
    <Row>
      <Col
        style={{
          fontWeight: "bold",
        }}
      >
        Title
      </Col>
      <Col span={12}></Col>
      <Col
        span={2}
        style={{
          fontWeight: "bold",
        }}
      >
        From
      </Col>
      <Col span={1}></Col>
      <Col
        span={2}
        style={{
          fontWeight: "bold",
        }}
      >
        To
      </Col>
      <Col span={1}></Col>
      <Col
        span={2}
        style={{
          fontWeight: "bold",
        }}
      >
        Role
      </Col>
      <Col span={1}></Col>
      <Col
        span={2}
        style={{
          fontWeight: "bold",
        }}
      >
        Credit Units
      </Col>
    </Row>
  );
}

function UserInfoField({ label, data, labelSpan, dataSpan }: UserInfoProps) {
  return (
    <Row>
      <Col
        span={labelSpan}
        style={{
          textAlign: "start",
        }}
      >
        {label}
      </Col>
      <Col
        span={dataSpan}
        style={{
          borderBottom: "1px solid black",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {data}
      </Col>
    </Row>
  );
}

function NameTitleSignatureField({
  name,
  title,
  signature,
  validated,
  tag,
  span,
  owner,
}: NameTitleSignatureProps) {
  console.log("SIGNATURE", signature, name);

  return (
    <Row style={{ position: "relative", bottom: "10px" }}>
      <Col span={span}>
        <Row style={{ position: "absolute", bottom: "55px" }}>{tag}</Row>
        <Row justify="center" style={{ height: "35px" }}>
          {validated || owner ? (
            <div
              style={{
                position: "relative",
                bottom: "0px",
                // display: "inline-block",
              }}
            >
              <Image width={180} height={60} src={signature} alt="Signature" />
            </div>
          ) : null}
        </Row>
        <Row
          justify="center"
          style={{
            borderBottom: "1px solid black",
            fontWeight: "bold",
          }}
        >
          {name}
        </Row>
        <Row justify="center">{title}</Row>
      </Col>
    </Row>
  );
}

function WorkloadCommitteeField({ name }: { name: string }) {
  return (
    <Row
      justify="center"
      style={{
        borderBottom: "1px solid black",
      }}
    >
      {name}
    </Row>
  );
}

class WorkloadFormToPrint extends Component<{
  workload: WorkloadDataProps | undefined;
  validators: any;
  ownerSignature: string;
}> {
  constructor(props: {
    workload: WorkloadDataProps;
    validators: any;
    ownerSignature: string;
  }) {
    super(props);
  }

  render() {
    return (
      <div
        style={{
          // background: "gray",
          width: "8.5in",
          height: "11in",
          // width: "210mm",
          // height: "297mm",
          // margin: "auto",
          padding: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
          fontSize: 11,
          lineHeight: "14px",
          background: "white",
        }}
      >
        <br />
        <Row justify="center">
          <Text strong>ISABELA STATE UNIVERSITY</Text>
        </Row>
        <Row justify="center">
          <Text strong>FACULTY WORKLOAD</Text>
        </Row>
        <br />
        <Row justify="start">
          <Col span={13}>
            <UserInfoField
              label="Semester/ Summer:"
              data={this.props.workload?.semester}
              labelSpan={11}
              dataSpan={12}
            />

            <UserInfoField
              label="Name:"
              data={toTitleCase(this.props.workload?.name)}
              labelSpan={6}
              dataSpan={17}
            />
            <UserInfoField
              label=" Baccalaureate Degree/ Specialization:"
              data={this.props.workload?.baccalaureate}
              labelSpan={11}
              dataSpan={12}
            />
            <UserInfoField
              label="Masteral Degree/ Specialization:"
              data={this.props.workload?.masteral}
              labelSpan={11}
              dataSpan={12}
            />
            <UserInfoField
              label="Doctorate Degree/ Specialization:"
              data={this.props.workload?.doctorate}
              labelSpan={11}
              dataSpan={12}
            />
          </Col>
          <Col span={1}></Col>
          <Col span={9}>
            <UserInfoField
              label="School Year:"
              data={getSchoolYear(this.props.workload?.schoolYear)}
              labelSpan={6}
              dataSpan={18}
            />
            <UserInfoField
              label="Campus:"
              data={this.props.workload?.campus}
              labelSpan={6}
              dataSpan={18}
            />
            <UserInfoField
              label="College:"
              data={this.props.workload?.college}
              labelSpan={6}
              dataSpan={18}
            />
            <UserInfoField
              label="Department"
              data=""
              labelSpan={6}
              dataSpan={18}
            />
          </Col>
        </Row>

        <br />

        <HorizontalLineInfo
          label={"A. Undergraduate"}
          total={this.props.workload?.undergraduateSumFTE}
        />
        <Row>
          <Col span={24}>
            <Table
              bordered={true}
              dataSource={this.props.workload?.undergraduate}
              columns={undergraduateColumns}
              // size="small"
              className={styles.antdTable}
              pagination={false}
              locale={{ emptyText: "No Data" }}
            />
          </Col>
        </Row>
        <br />

        <HorizontalLineInfo
          label={"B. Graduate"}
          total={this.props.workload?.graduateSumCreditUnits}
        />
        <Row>
          <Col span={24}>
            <Table
              bordered
              dataSource={this.props.workload?.graduate}
              columns={graduateColumns}
              // size="small"
              className={styles.antdTable}
              pagination={false}
              locale={{ emptyText: "No Data" }}
            />
          </Col>
        </Row>
        <br />
        <HorizontalLineInfo
          label="C. Research"
          total={this.props.workload?.researchUnitsSum}
        />
        <ResearchAndProductionHeader />
        {this.props.workload?.research === undefined ? (
          <ResearchFormFields
            count="1."
            title=""
            from=""
            to=""
            role=""
            creditUnits=""
          />
        ) : (
          this.props.workload.research.map((item, index) => {
            return (
              <ResearchFormFields
                key={index}
                count={index + 1 + ". "}
                title={item.title}
                from={moment(item.date[0]).format("ll")}
                to={moment(item.date[1]).format("ll")}
                role={item.role}
                creditUnits={item.units}
              />
            );
          })
        )}

        <br />

        <HorizontalLineInfo
          label="D. Extension/ Production"
          total={this.props.workload?.extensionProductionSum}
        />
        <ResearchAndProductionHeader />
        {this.props.workload?.production === undefined ? (
          <ResearchFormFields
            count="1."
            title=""
            from=""
            to=""
            role=""
            creditUnits=""
          />
        ) : (
          this.props.workload.production.map((item, index) => {
            return (
              <ResearchFormFields
                key={index}
                count={index + 1 + ". "}
                title={item.title}
                from={moment(item.date[0]).format("ll")}
                to={moment(item.date[1]).format("ll")}
                role={item.role}
                creditUnits={item.units}
              />
            );
          })
        )}
        {/* <ResearchFormFields
          count="1."
          title=""
          from=""
          to=""
          role=""
          creditUnits=""
        />
        <ResearchFormFields
          count="2."
          title=""
          from=""
          to=""
          role=""
          creditUnits=""
        /> */}
        <br />
        <HorizontalLineInfo label="E. Administration" total="0" />

        <Row justify="center">
          <Col span={2}>Position</Col>
          <Col
            span={10}
            style={{
              borderBottom: "1px solid black",
            }}
          >
            {toTitleCase(this.props.workload?.position)}
          </Col>
          <Col span={10}></Col>
          <Col
            span={2}
            style={{
              borderBottom: "1px solid black",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            4
          </Col>
        </Row>
        <br />
        <Row>
          {/* <Col span={3}>Prepared by:</Col> */}
          <Col span={18}></Col>
          <Col
            span={4}
            style={{
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            Total Faculty Workload
          </Col>
          <Col
            span={2}
            style={{
              borderBottom: "1px solid black",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {this.props.workload?.totalFacultyWorkload}
          </Col>
        </Row>
        <Row justify="end">
          <Col
            span={4}
            style={{
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            Excess Faculty Workload
          </Col>
          <Col
            span={2}
            style={{
              borderBottom: "1px solid black",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {this.props.workload?.excessFacultyWorkload}
          </Col>
        </Row>
        <NameTitleSignatureField
          name={`${this.props.workload?.name.toUpperCase()}, ${
            this.props.workload?.doctorate
          }`}
          title="Faculty"
          signature={this.props.ownerSignature}
          owner={true}
          tag="Prepared by:"
          span={6}
        />
        <br />
        <Row>
          <Col span={9} style={{ height: "10px" }}>
            {/* <Row>left</Row> */}
            <br />
            {/* <Row style={{ position: "absolute" }}>Verified by:</Row> */}
            {/* <br /> */}

            <NameTitleSignatureField
              name={`${this.props.validators[0].username.toUpperCase()}, ${
                this.props.validators[0].extension
              }`}
              title={this.props.validators[0].position}
              signature={this.props.validators[0].signature}
              validated={this.props.validators[0].validated}
              tag="Verified by:"
              span={17}
            />

            {/* <Row>Certified Correct:</Row> */}

            <br />
            <NameTitleSignatureField
              name={`${this.props.validators[1].username.toUpperCase()}, ${
                this.props.validators[1].extension
              }`}
              title={`${this.props.validators[1].position}, ${this.props.validators[1].college}`}
              signature={this.props.validators[1].signature}
              validated={this.props.validators[1].validated}
              tag="Certified Correct:"
              span={17}
            />
            <NameTitleSignatureField
              name={`${this.props.validators[2].username.toUpperCase()}, ${
                this.props.validators[2].extension
              }`}
              title={this.props.validators[2].position}
              signature={this.props.validators[2].signature}
              validated={this.props.validators[2].validated}
              span={17}
            />
          </Col>
          <Col span={4}></Col>
          <Col span={10} style={{ position: "relative", bottom: "30px" }}>
            <Row>Checked by:</Row>
            <br />
            <Row
              justify="center"
              style={{
                fontWeight: "bold",
              }}
            >
              CAMPUS FACULTY WORKLOAD COMMITTEE
            </Row>

            <Row justify="center">
              <Col span={12} style={{ height: "10px" }}>
                <NameTitleSignatureField
                  name={`${this.props.validators[3].username.toUpperCase()}, ${
                    this.props.validators[3].extension
                  }`}
                  title={this.props.validators[3].position}
                  signature={this.props.validators[3].signature}
                  validated={this.props.validators[3].validated}
                  span={22}
                />
              </Col>
              <Col span={1}></Col>

              <Col span={11}>
                <NameTitleSignatureField
                  name={`${this.props.validators[4].username.toUpperCase()}, ${
                    this.props.validators[4].extension
                  }`}
                  title={this.props.validators[4].position}
                  signature={this.props.validators[4].signature}
                  validated={this.props.validators[4].validated}
                />
              </Col>
            </Row>
            <Row justify="center">
              <Col span={18}>
                <NameTitleSignatureField
                  name={`${this.props.validators[5].username.toUpperCase()}, ${
                    this.props.validators[5].extension
                  }`}
                  title={this.props.validators[5].position}
                  signature={this.props.validators[5].signature}
                  validated={this.props.validators[5].validated}
                  span={24}
                />
                <br />
                <Row>
                  <Col span={24}>
                    <Row
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      University Workload Committee:
                    </Row>
                    <br />
                    <WorkloadCommitteeField name="" />
                    <br />
                    <WorkloadCommitteeField name="" />
                    <br />
                    <WorkloadCommitteeField name="" />
                    <br />
                    <WorkloadCommitteeField name="" />
                    <br />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

interface WorkloadItemProps {
  selectedItem: WorkloadDataProps;
}

function WorkloadItem({ workload, campusId, role, positionIndex }: any) {
  const [_, __, ___, ____, userData] = useAuthSession();
  console.log("signature", workload.ownerSignature);

  const selectedItem: WorkloadDataProps = workload.workload;
  const withUIDValidators = workload.validators;
  const validators = Object.values(withUIDValidators).sort(
    (a: any, b: any) => a.positionIndex - b.positionIndex
  );

  console.log(validators, "dators");

  // const sortedValidators = workload.validators.sort(
  //   (a: any, b: any) => a.positionIndex - b.positionIndex
  // );

  const { setSelectedItem, setActiveComponent } = useContext(
    ActiveComponentContext
  )!;

  const [submitted, setSubmitted] = useState(
    workload.validationProgress > positionIndex
  );

  const [submitting, setSubmitting] = useState(false);

  let componentRef = useRef<any>();

  if (!userData) {
    return <LoadingScreen />;
  }

  return (
    <Layout style={{ height: "100vh" }}>
      <WorkloadHeader />
      <Layout
        style={{
          marginTop: "10px",
        }}
      >
        <Content
          style={{ margin: "0px 10px", background: "#fff", overflow: "auto" }}
        >
          <PageHeader
            style={{
              borderBottom: "1px solid",
              borderColor: "rgb(198,198,198)",
            }}
            onBack={() => {
              setSelectedItem(null);
              setActiveComponent(ActiveComponent.WorkloadIndex);
            }}
            title={`Workload | ${getDate(selectedItem.createdAt)}`}
            extra={[
              <div key={"base"}>
                {role === "VALIDATOR" ? (
                  <div>
                    <ReactToPrint
                      key={"print"}
                      trigger={() => <Button type="default">PRINT</Button>}
                      content={() => componentRef.current!}
                    />
                    <Popconfirm
                      disabled={submitted}
                      key={"approve"}
                      title="Are you sure you want to approve this workload?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => {
                        if (!userData.signature) {
                          message.error(
                            "Please check your profile and provide a signature"
                          );
                          return;
                        }
                        // unsubmitWorkload(workload.workloadId, "Echague Campus");
                        submitWorkload(
                          workload.workloadId,
                          campusId,
                          true,
                          userData.uid
                        ).then(() => {
                          setSubmitted(true);
                          message.success("Workload approved!");
                        });
                        // setSubmitted(false);
                      }}
                      onCancel={() => {}}
                    >
                      <Button
                        disabled={submitted}
                        key="1"
                        type="primary"
                        onClick={() => {}}
                      >
                        {submitted ? "APPROVED" : "APPROVE"}
                      </Button>
                    </Popconfirm>
                  </div>
                ) : (
                  <div>
                    <Popconfirm
                      title="Are you sure you want to DELETE this workload?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => {
                        setTimeout(() => {
                          deleteWorkload(workload.workloadId, campusId).then(
                            () => {
                              // setSelectedItem(null);
                              setActiveComponent(ActiveComponent.WorkloadIndex);
                              message.warning("Workload Deleted!");
                            }
                          );
                        });
                      }}
                      onCancel={() => {}}
                    >
                      <Button key="" danger onClick={() => {}}>
                        DELETE
                      </Button>
                    </Popconfirm>
                    <ReactToPrint
                      key={"print"}
                      trigger={() => <Button type="default">PRINT</Button>}
                      content={() => componentRef.current!}
                    />
                    {/* <Button key="edit" type="default">
                      EDIT
                    </Button> */}
                    {!submitted ? (
                      <Button
                        key="submit"
                        type="primary"
                        onClick={() => {
                          if (!userData.signature) {
                            message.error(
                              "Please check your profile and provide a signature"
                            );
                            return;
                          }
                          setSubmitting(true);
                          setTimeout(() => {
                            submitWorkload(workload.workloadId, campusId);
                            setSubmitting(false);
                            setSubmitted(true);
                            message.success("Workload Submitted!");
                          }, 1000);
                        }}
                      >
                        {submitting ? "SUMITTING..." : "SUBMIT"}
                      </Button>
                    ) : (
                      <Popconfirm
                        key={"unsubmit"}
                        title="Are you sure you want to unsubmit this workload?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => {
                          unsubmitWorkload(workload.workloadId, campusId);
                          setSubmitted(false);
                        }}
                        onCancel={() => {}}
                      >
                        <Button key="1" type="dashed" onClick={() => {}}>
                          UNSUBMIT
                        </Button>
                      </Popconfirm>
                    )}
                  </div>
                )}
              </div>,
            ]}
          />
          <Row justify="center">
            <Col>
              <div
                style={{
                  border: "1px solid black",
                  width: "8.6in",
                  height: "11.1in",
                  // margin: "auto",
                }}
              >
                <WorkloadFormToPrint
                  ref={componentRef}
                  workload={selectedItem}
                  validators={validators}
                  ownerSignature={workload.ownerSignature}
                />
              </div>
            </Col>
            <Col style={{ marginLeft: "30px" }}>
              <Row>
                <Col>
                  <Image
                    width={200}
                    src="https://firebasestorage.googleapis.com/v0/b/isu-faculty-workload.appspot.com/o/iso.png?alt=media&token=5dc64552-beea-4f34-83c9-b4503a706357"
                    alt="Test image"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Image
                    width={200}
                    src="https://firebasestorage.googleapis.com/v0/b/isu-faculty-workload.appspot.com/o/iso.png?alt=media&token=5dc64552-beea-4f34-83c9-b4503a706357"
                    alt="Test image"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Image
                    width={200}
                    src="https://firebasestorage.googleapis.com/v0/b/isu-faculty-workload.appspot.com/o/iso.png?alt=media&token=5dc64552-beea-4f34-83c9-b4503a706357"
                    alt="Test image"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <br />
        </Content>
        <ProgressSider
          validators={validators}
          validationProgress={workload.validationProgress}
        />
      </Layout>
    </Layout>
  );
}

export default WorkloadItem;
