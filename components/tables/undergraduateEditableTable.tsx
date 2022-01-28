import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form, Tag, Row } from "antd";
import { FormInstance } from "antd/lib/form";
import styles from "styles/EditableTable.module.css";
import { UndergraduateProps } from "constants/interface/tableProps";
import TextArea from "antd/lib/input/TextArea";
import TableDataContext from "context/tableContext";

// const { Text } = Typography;

// const EditableContext = React.createContext<FormInstance<any> | null>(null);

// interface EditableRowProps {
//   index: number;
// }

// const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
//   const [form] = Form.useForm();
//   return (
//     <Form form={form} component={false}>
//       <EditableContext.Provider value={form}>
//         <tr {...props} />
//       </EditableContext.Provider>
//     </Form>
//   );
// };

// interface EditableCellProps {
//   title: React.ReactNode;
//   editable: boolean;
//   children: React.ReactNode;
//   dataIndex: keyof UndergraduateProps;
//   record: UndergraduateProps;
//   handleSave: (record: UndergraduateProps) => void;
// }

// const EditableCell: React.FC<EditableCellProps> = ({
//   title,
//   editable,
//   children,
//   dataIndex,
//   record,
//   handleSave,
//   ...restProps
// }) => {
//   const [editing, setEditing] = useState(false);
//   const inputRef = useRef<Input>(null);
//   const form = useContext(EditableContext)!;

//   useEffect(() => {
//     if (editing) {
//       // inputRef.current!.focus();
//     }
//   }, [editing]);

//   const toggleEdit = () => {
//     setEditing(!editing);
//     form.setFieldsValue({ [dataIndex]: record[dataIndex] });
//   };

//   const save = async () => {
//     console.log("save");

//     try {
//       const values = await form.validateFields();

//       // toggleEdit();
//       handleSave({ ...record, ...values });
//     } catch (errInfo) {
//       console.log("Save failed:", errInfo);
//     }
//   };

//   let childNode = children;

//   if (editable) {
//     childNode = editing ? (
//       <Form.Item
//         style={{ margin: 0 }}
//         name={dataIndex}
//         rules={[
//           {
//             required: true,
//             message: `${title} is required.`,
//           },
//         ]}
//       >
//         <Input
//           style={{
//             textTransform:
//               dataIndex !== "descriptiveTitle" ? "uppercase" : "capitalize",
//           }}
//           ref={inputRef}
//           onBlur={save}
//           onMouseLeave={save}
//         />
//       </Form.Item>
//     ) : (
//       <div
//         className={styles.editableCellValueWrap}
//         style={{
//           paddingRight: 10,
//           textTransform:
//             dataIndex !== "descriptiveTitle" ? "uppercase" : "capitalize",
//         }}
//         onClick={toggleEdit}
//       >
//         {children}
//       </div>
//     );
//   }

//   return <td {...restProps}>{childNode}</td>;
// };

// type EditableTableProps = Parameters<typeof Table>[0];

// interface DataType {
//   key: React.Key;
//   courseCode: string;
//   descriptiveTitle: string;
//   subjectLabel: string;
//   programYearLevel: string;
//   units: string;
//   lecHours: string;
//   labHours: string;
//   schedule: string;
//   totalStudents?: string;
//   rooms: string;
//   lectureFTE?: number;
//   labFTE?: number;
//   totalFTE?: number;
// }

// type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

// export const UndergraduateEditableTable: React.FC = () => {
//   const [data, setData] = useState<DataType[] | []>([]);
//   const [count, setCount] = useState<number>(data.length);
//   const { setUndergraduateTableData } = { ...useContext(WorkloadContext) };

//   useEffect(() => {
//     setUndergraduateTableData(data);
//   }, [data]);

//   const handleAdd = () => {
//     setCount(count + 1);

//     const newData: DataType = {
//       key: count + 1,
//       courseCode: "COURSE",
//       descriptiveTitle: "TITLE",
//       subjectLabel: "SUBJECT",
//       programYearLevel: "PROGRAM",
//       lecHours: "0",
//       labHours: "0",
//       units: "0",
//       totalStudents: "0",
//       schedule: "SCHEDULE",
//       rooms: "ROOM",
//     };
//     console.log(data);

//     setData([...data, newData]);
//   };

//   const handleSave = (row: DataType) => {
//     const newData = data;
//     const index = newData.findIndex((item) => row.key === item.key);
//     let item = newData[index];
//     console.log("lec", Number(item.lecHours));
//     const lectureFTE = Number(item.lecHours);
//     const labFTE = Number(item.labHours);
//     const totalFTE = lectureFTE + labFTE;
//     item = {
//       ...item,
//       lectureFTE: lectureFTE,
//       labFTE: labFTE,
//       totalFTE: totalFTE,
//     };
//     console.log(item);

//     newData.splice(index, 1, { ...item, ...row });
//     setData([...newData]);
//   };

//   const handleDelete = (key: React.Key) => {
//     setData(data.filter((item) => item.key !== key));
//   };

//   const columns = [
//     {
//       title: "SUBJECT / COURCE CODE",
//       dataIndex: "courseCode",
//       key: "name",
//       render: (text: string) => <a>{text}</a>,
//       width: 50,
//       editable: true,
//     },
//     {
//       title: "DESCRIPTIVE TITLE",
//       dataIndex: "descriptiveTitle",
//       width: 80,
//       key: "age",
//       editable: true,
//     },
//     {
//       title: "REGULAR / UNPROG SUBJECT",
//       dataIndex: "subjectLabel",
//       key: "subjectLabel",
//       width: 50,
//       editable: true,
//     },
//     {
//       title: "PROGRAM YEAR LEVEL",
//       key: "tags",
//       dataIndex: "programYearLevel",
//       width: 50,
//       editable: true,
//     },
//     {
//       title: "UNITS",
//       key: "action",
//       width: 35,
//       dataIndex: "units",
//       editable: true,
//     },
//     // {
//     //   title: "NO. OF HOURS",
//     //   key: "hours",
//     //   editable: true,
//     //   children: [
//     //     {
//     //       title: "LEC",
//     //       dataIndex: "lectureHours",
//     //       key: 1,
//     //       width: 25,
//     //       editable: true,
//     //     },
//     //     {
//     //       title: "LAB",
//     //       dataIndex: "labHours",
//     //       width: 25,
//     //       key: 2,
//     //       editable: true,
//     //     },
//     //   ],
//     // },

//     {
//       title: "LEC HRS",
//       key: "lecHours",
//       width: 35,
//       dataIndex: "lecHours",
//       editable: true,
//     },

//     {
//       title: "LAB HRS",
//       key: "labHours",
//       width: 35,
//       dataIndex: "labHours",
//       editable: true,
//     },
//     {
//       title: "SCHEDULE",
//       dataIndex: "schedule",
//       key: "schedule",
//       width: 55,
//       editable: true,
//     },
//     {
//       title: "NO. OF STUDENTS",
//       dataIndex: "totalStudents",
//       key: "students",
//       width: 50,
//       editable: true,
//     },
//     {
//       title: "ROOMS",
//       dataIndex: "rooms",
//       key: "address",
//       width: 50,
//       editable: true,
//     },

//     {
//       title: "FTE",
//       children: [
//         {
//           title: "LEC",
//           dataIndex: "lecHours",
//           width: 25,
//           key: 3,
//           editable: true,
//         },
//         {
//           title: "LAB",
//           dataIndex: "labHours",
//           width: 25,
//           key: 4,
//           editable: true,
//         },
//       ],
//     },
//     {
//       title: "TOTAL FTE",
//       // dataIndex: ["lecHours"],
//       key: "total",
//       width: 35,
//       render: (x: any, record: any) => {
//         const totalFTE = Number(record.labHours) + Number(record.lecHours);
//         if (isNaN(totalFTE)) return 0;

//         return totalFTE;
//       },
//     },
//     {
//       title: <Tag color="blue">OPERATION</Tag>,
//       dataIndex: "operation",
//       width: 45,
//       fixed: "right",
//       render: (_: any, record: { key: React.Key }) =>
//         data.length >= 1 ? (
//           <Popconfirm
//             title="Sure to delete?"
//             onConfirm={() => handleDelete(record.key)}
//           >
//             <Text type="danger" style={{ cursor: "pointer" }}>
//               DELETE
//             </Text>
//           </Popconfirm>
//         ) : null,
//     },
//   ];

//   const components = {
//     body: {
//       row: EditableRow,
//       cell: EditableCell,
//     },
//   };
//   const newColumns = columns.map((col) => {
//     if (!col.editable) {
//       return col;
//     }
//     return {
//       ...col,
//       onCell: (record: DataType) => ({
//         record,
//         editable: col.editable,
//         dataIndex: col.dataIndex,
//         title: col.title,
//         handleSave: handleSave,
//       }),
//     };
//   });

//   return (
//     <>
//       <Row>
//         <Divider orientation="left" orientationMargin="0">
//           A. Undergraduate
//         </Divider>
//         <Table
//           components={components}
//           // rowClassName={() => "editable-row"}
//           pagination={false}
//           scroll={{
//             y: 440,
//             x: 1250,
//           }}
//           bordered
//           size="small"
//           dataSource={data}
//           columns={newColumns as ColumnTypes}
//           rowClassName={styles.editableRow}
//         />
//       </Row>
//       <Row justify="end">
//         <Button
//           onClick={handleAdd}
//           type="primary"
//           style={{ marginBottom: 16, justifyItems: "end" }}
//         >
//           Add a row
//         </Button>
//       </Row>
//     </>
//   );
// };

const UndergraduateEditableContext =
  React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <UndergraduateEditableContext.Provider value={form}>
        <tr {...props} />
      </UndergraduateEditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof UndergraduateProps;
  record: UndergraduateProps;
  handleSave: (record: UndergraduateProps) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<Input>(null);
  const form = useContext(UndergraduateEditableContext)!;
  // const { setUndergraduateTableData } = { ...useContext(WorkloadContext) };

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
      console.log("SAVE");

      // setUndergraduateTableData({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <TextArea
          style={{
            padding: "2px",
            textTransform:
              dataIndex !== "descriptiveTitle" ? "uppercase" : "capitalize",
          }}
          ref={inputRef}
          onBlur={save}
          onMouseLeave={save}
        />
      </Form.Item>
    ) : (
      <div
        className={styles.editableCellValueWrap}
        style={{
          paddingRight: 10,
          textTransform:
            dataIndex !== "descriptiveTitle" ? "uppercase" : "capitalize",
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key?: React.Key;
  courseCode: string;
  descriptiveTitle: string;
  subjectLabel: string;
  programYearLevel: string;
  units: string;
  lecHours: string;
  labHours: string;
  schedule: string;
  totalStudents?: string;
  rooms: string;
  lectureFTE?: number;
  labFTE?: number;
  totalFTE?: number;
}

interface EditableTableState {
  dataSource: DataType[];
  count: number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

export class UndergraduateEditableTable extends React.Component<
  EditableTableProps,
  EditableTableState
> {
  columns: any;
  static contextType = TableDataContext;

  constructor(props: EditableTableProps) {
    super(props);

    this.columns = [
      {
        title: "SUBJECT / COURCE CODE",
        dataIndex: "courseCode",
        key: "name",
        render: (text: string) => <a>{text}</a>,
        width: 50,
        editable: true,
      },
      {
        title: "DESCRIPTIVE TITLE",
        dataIndex: "descriptiveTitle",
        width: 80,
        key: "age",
        editable: true,
      },
      {
        title: "REGULAR / UNPROG SUBJECT",
        dataIndex: "subjectLabel",
        key: "subjectLabel",
        width: 50,
        editable: true,
      },
      {
        title: "PROGRAM YEAR LEVEL",
        key: "tags",
        dataIndex: "programYearLevel",
        width: 50,
        editable: true,
      },
      {
        title: "UNITS",
        key: "action",
        width: 35,
        dataIndex: "units",
        editable: true,
      },
      // {
      //   title: "NO. OF HOURS",
      //   key: "hours",
      //   editable: true,
      //   children: [
      //     {
      //       title: "LEC",
      //       dataIndex: "lectureHours",
      //       key: 1,
      //       width: 25,
      //       editable: true,
      //     },
      //     {
      //       title: "LAB",
      //       dataIndex: "labHours",
      //       width: 25,
      //       key: 2,
      //       editable: true,
      //     },
      //   ],
      // },

      {
        title: "LEC HRS",
        key: "lecHours",
        width: 35,
        dataIndex: "lecHours",
        editable: true,
      },

      {
        title: "LAB HRS",
        key: "labHours",
        width: 35,
        dataIndex: "labHours",
        editable: true,
      },
      {
        title: "SCHEDULE",
        dataIndex: "schedule",
        key: "schedule",
        width: 55,
        editable: true,
      },
      {
        title: "NO. OF STUDENTS",
        dataIndex: "totalStudents",
        key: "students",
        width: 50,
        editable: true,
      },
      {
        title: "ROOMS",
        dataIndex: "rooms",
        key: "address",
        width: 50,
        editable: true,
      },

      {
        title: "FTE",
        children: [
          {
            title: "LEC",
            dataIndex: "lecHours",
            width: 25,
            key: 3,
            editable: true,
          },
          {
            title: "LAB",
            dataIndex: "labHours",
            width: 25,
            key: 4,
          },
        ],
      },
      {
        title: "TOTAL FTE",
        // dataIndex: ["lecHours"],
        key: "total",
        width: 35,
        render: (x: any, record: any) => {
          const totalFTE = Number(record.labHours) + Number(record.lecHours);
          if (isNaN(totalFTE)) return 0;

          return totalFTE;
        },
      },
      {
        title: <Tag color="blue">OPERATION</Tag>,
        dataIndex: "operation",
        width: 45,
        fixed: "right",
        render: (_: any, record: { key: React.Key }) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <div style={{ cursor: "pointer", color: "red" }}>DELETE</div>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      dataSource: [
        {
          key: "1",
          courseCode: "CS 411",
          descriptiveTitle: "CS Thesis Writing 2",
          subjectLabel: "REGULAR",
          programYearLevel: "BSCS 4A",
          units: "3",
          lecHours: "2",
          labHours: "3",
          schedule: "MON 6-10 WED 7-10",
          totalStudents: "45",
          rooms: "ITRM 104 / RMBLAB 104",
          lectureFTE: 2,
          labFTE: 3,
          totalFTE: 5,
        },
      ],
      count: 1,
    };
  }
  handleDelete = (key: React.Key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };

  handleAdd = () => {
    this.setState({ count: this.state.count + 1 });
    const { dataSource } = this.state;
    const newData: DataType = {
      key: this.state.count + 1,
      courseCode: "COURSE",
      descriptiveTitle: "TITLE",
      subjectLabel: "SUBJECT",
      programYearLevel: "PROGRAM",
      lecHours: "0",
      labHours: "0",
      units: "0",
      totalStudents: "0",
      schedule: "SCHEDULE",
      rooms: "ROOM",
    };

    this.setState({
      dataSource: [...dataSource, newData],
    });
  };

  handleSave = (row: DataType) => {
    const { setUndergraduateTableData } = this.context;
    const newData = [...this.state.dataSource];

    const lectureFTE = Number(row.lecHours);
    const labFTE = Number(row.labHours);
    const totalFTE = lectureFTE + labFTE;
    const newItem = { ...row, lectureFTE, labFTE, totalFTE };
    console.log(newItem);

    const index = newData.findIndex((item) => item.key == newItem.key);
    newData.splice(index, 1, { ...newItem });
    this.setState({ dataSource: newData });
    setUndergraduateTableData([...newData]);
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col: any) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: DataType) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          size="small"
          className={styles.antdTable}
          components={components}
          rowClassName={styles.editableRow}
          pagination={false}
          bordered
          dataSource={dataSource}
          columns={columns as ColumnTypes}
          scroll={{
            y: 440,
            x: 1250,
          }}
        />
        <Row justify="end">
          <Button
            onClick={this.handleAdd}
            type="primary"
            style={{ marginBottom: 16 }}
          >
            Add a row
          </Button>
        </Row>
      </div>
    );
  }
}
