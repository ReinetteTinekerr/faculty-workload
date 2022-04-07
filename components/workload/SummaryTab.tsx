import { Button, Empty, Row, Table, Typography } from "antd";
import { summaryColumns } from "data/data";
import { Component, useRef } from "react";
import ReactToPrint from "react-to-print";
const { Title } = Typography;

import styles from "styles/ID.module.css";

export function SummaryTab({ summary }: { summary: any }) {
  let componentRef = useRef<any>();
  return (
    <>
      {Object.keys(summary).length > 0 ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              // margin: "auto",
            }}
          >
            <ReactToPrint
              key={"print"}
              trigger={() => (
                <Button type="primary" shape="round">
                  PRINT
                </Button>
              )}
              content={() => componentRef.current!}
            />
          </div>
          <div
            style={{
              // background: "gray",
              width: "8.5in",
              height: "11in",
              // width: "210mm",
              // height: "297mm",
              margin: "auto",
              padding: "10px",
              paddingLeft: "20px",
              paddingRight: "20px",
              fontSize: 11,
              lineHeight: "14px",
              background: "white",
            }}
          >
            {/* {JSON.stringify(summary)} */}

            <SummaryFormToPrint summary={summary} ref={componentRef} />
          </div>
        </>
      ) : (
        <Empty></Empty>
      )}
    </>
  );
}

class SummaryFormToPrint extends Component<{ summary: any }> {
  constructor(props: any) {
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
          margin: "auto",
          padding: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
          fontSize: 11,
          lineHeight: "14px",
          background: "white",
        }}
      >
        {/* {JSON.stringify(summary)} */}
        <Row justify="center">
          <Title level={4}>Summary Report</Title>
        </Row>
        <Row justify="center">
          <Table
            columns={summaryColumns}
            bordered
            dataSource={this.props.summary}
            className={styles.summary}
            pagination={false}
          />
        </Row>
      </div>
    );
  }
}
