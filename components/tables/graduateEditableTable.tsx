import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Typography,
  Tag,
  Select,
  Row,
  Divider,
} from "antd";
import { FormInstance } from "antd/lib/form";
import { graduateData } from "data/data";
import styles from "styles/EditableTable.module.css";
import { GraduateProps } from "constants/interface/tableProps";
import WorkloadContext from "context/workloadContext";
import TextArea from "antd/lib/input/TextArea";
import TableDataContext from "context/tableContext";

const { Text } = Typography;
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
//   dataIndex: keyof GraduateProps;
//   record: GraduateProps;
//   handleSave: (record: GraduateProps) => void;
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
//     try {
//       const values = await form.validateFields();

//       toggleEdit();
//       handleSave({ ...record, ...values });
//     } catch (errInfo) {
//
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
//         {/* {dataIndex == "subjectLabel" ? (
//           <Select
//             showSearch
//             placeholder="Search to Select"
//             optionFilterProp="children"
//             filterOption={(input: any, option: any) => {
//               return (
//                 option?.children
//                   ?.toString()
//                   .toLowerCase()
//                   .indexOf(input.toLowerCase()) >= 0
//               );
//             }}
//             filterSort={(optionA, optionB) =>
//               optionA.children
//                 .toLowerCase()
//                 .localeCompare(optionB.children.toLowerCase())
//             }
//           >
//             <Option value="1">REGULAR</Option>
//             <Option value="2">UNPROG</Option>
//           </Select> */}
//         <Input
//           style={{
//             textTransform:
//               dataIndex !== "courseDescription" ? "uppercase" : "capitalize",
//           }}
//           ref={inputRef}
//           onPressEnter={save}
//           onBlur={save}
//         />
//       </Form.Item>
//     ) : (
//       <div
//         className={styles.editableCellValueWrap}
//         style={{
//           paddingRight: 10,
//           textTransform:
//             dataIndex !== "courseDescription" ? "uppercase" : "capitalize",
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
//   courseNo: string;
//   courseDescription: string;
//   curricular: string;
//   totalStudents?: number;
//   units?: number;
//   lectureHours?: number;
//   labHours?: number;
//   lectureUnits?: number;
//   labUnits?: number;
// }

// type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

// export const GraduateEditableTable: React.FC = () => {
//   const [data, setData] = useState<DataType[] | []>([]);
//   const [count, setCount] = useState<number>(data.length);

//   const { setGraduateTableData } = { ...useContext(WorkloadContext) };

//   useEffect(() => {
//     setGraduateTableData(data);
//   }, [data]);

//   const handleAdd = () => {
//     setCount(count + 1);

//     const newData: DataType = {
//       key: count + 1,
//       courseNo: " ",
//       courseDescription: "DESCRIPTION",
//       curricular: "CURRICULAR",
//       totalStudents: 0,
//       units: 0,
//       labHours: 0,
//       lectureHours: 0,
//       labUnits: 0,
//       lectureUnits: 0,
//     };
//

//     setData([...data, newData]);
//   };

//   const handleSave = (row: DataType) => {
//     const newData = data;
//     const index = newData.findIndex((item) => row.key === item.key);
//     const item = newData[index];
//     newData.splice(index, 1, {
//       ...item,
//       ...row,
//     });
//     setData([...newData]);
//   };

//   const handleDelete = (key: React.Key) => {
//     setData(data.filter((item) => item.key !== key));
//   };

//   const columns = [
//     {
//       title: "Course No.",
//       dataIndex: "courseNo",
//       key: "courseNo",
//       render: (text: string) => <a>{text}</a>,
//       width: 25,
//       editable: true,
//     },
//     {
//       title: "Course Description",
//       dataIndex: "courseDescription",
//       width: 50,
//       key: "description",
//       editable: true,
//     },
//     {
//       title: "Curricular Program and Year Level",
//       dataIndex: "curricular",
//       width: 40,
//       key: "curricular",
//       editable: true,
//     },
//     {
//       title: "NO. OF STUDENTS",
//       dataIndex: "totalStudents",
//       width: 25,
//       key: "totalStudents",
//       editable: true,
//     },
//     {
//       title: "Units",
//       dataIndex: "units",
//       width: 15,
//       key: "units",
//       editable: true,
//     },
//     {
//       title: "Contact Hrs/wk Lect",
//       dataIndex: "lectureHours",
//       key: 1,
//       width: 20,
//       editable: true,
//     },
//     {
//       title: "Contact Hrs/wk Lab",
//       dataIndex: "labHours",
//       width: 20,
//       key: 2,
//       editable: true,
//     },
//     // {
//     //   title: "Contact Hrs/wk",
//     //   key: "contactHrsWk",
//     //   children: [
//     //   ],
//     // },

//     {
//       title: "Credit Units Lect",
//       dataIndex: "lectureUnits",
//       key: 1,
//       width: 20,
//       editable: true,
//     },
//     {
//       title: "Credit Untis Lab",
//       dataIndex: "labUnits",
//       width: 20,
//       key: 2,
//       editable: true,
//     },

//     // {
//     //   title: "Credit Units",
//     //   key: "creditUnits",
//     //   children: [
//     //   ],
//     // },

//     {
//       title: <Tag color="blue">OPERATION</Tag>,
//       dataIndex: "operation",
//       width: 25,
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
//           B. Graduate
//         </Divider>
//         <Table
//           components={components}
//           // rowClassName={() => "editable-row"}
//           pagination={false}
//           scroll={{
//             y: 440,
//             x: 930,
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

const GraduateEditableContext = React.createContext<FormInstance<any> | null>(
  null
);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <GraduateEditableContext.Provider value={form}>
        <tr {...props} />
      </GraduateEditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof GraduateProps;
  record: GraduateProps;
  handleSave: (record: GraduateProps) => void;
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
  const form = useContext(GraduateEditableContext)!;
  const { setGraduateTableData } = { ...useContext(TableDataContext) };

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

      setGraduateTableData({ ...record, ...values });
    } catch (errInfo) {}
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
              dataIndex !== "courseDescription" ? "uppercase" : "capitalize",
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
            dataIndex !== "courseDescription" ? "uppercase" : "capitalize",
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
  key: React.Key;
  courseNo: string;
  courseDescription: string;
  curricular: string;
  totalStudents?: number;
  units?: number;
  lectureHours?: number;
  labHours?: number;
  lectureUnits?: number;
  labUnits?: number;
}

interface EditableTableState {
  dataSource: DataType[];
  count: number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

export class GraduateEditableTable extends React.Component<
  EditableTableProps,
  EditableTableState
> {
  columns: any;
  static contextType = TableDataContext;

  constructor(props: EditableTableProps) {
    super(props);

    this.columns = [
      {
        title: "Course No.",
        dataIndex: "courseNo",
        key: "courseNo",
        render: (text: string) => <a>{text}</a>,
        width: 25,
        editable: true,
      },
      {
        title: "Course Description",
        dataIndex: "courseDescription",
        width: 50,
        key: "description",
        editable: true,
      },
      {
        title: "Curricular Program and Year Level",
        dataIndex: "curricular",
        width: 40,
        key: "curricular",
        editable: true,
      },
      {
        title: "NO. OF STUDENTS",
        dataIndex: "totalStudents",
        width: 25,
        key: "totalStudents",
        editable: true,
      },
      {
        title: "Units",
        dataIndex: "units",
        width: 15,
        key: "units",
        editable: true,
      },
      {
        title: "Contact Hrs/wk Lect",
        dataIndex: "lectureHours",
        key: 1,
        width: 20,
        editable: true,
      },
      {
        title: "Contact Hrs/wk Lab",
        dataIndex: "labHours",
        width: 20,
        key: 2,
        editable: true,
      },
      // {
      //   title: "Contact Hrs/wk",
      //   key: "contactHrsWk",
      //   children: [
      //   ],
      // },

      {
        title: "Credit Units Lect",
        dataIndex: "lectureUnits",
        key: 1,
        width: 20,
        editable: true,
      },
      {
        title: "Credit Untis Lab",
        dataIndex: "labUnits",
        width: 20,
        key: 2,
        editable: true,
      },

      // {
      //   title: "Credit Units",
      //   key: "creditUnits",
      //   children: [
      //   ],
      // },

      {
        title: <Tag color="blue">OPERATION</Tag>,
        dataIndex: "operation",
        width: 25,
        fixed: "right",
        render: (_: any, record: { key: React.Key }) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <Text type="danger" style={{ cursor: "pointer" }}>
                DELETE
              </Text>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      dataSource: [
        {
          key: 0,
          courseNo: " ",
          courseDescription: "DESCRIPTION",
          curricular: "CURRICULAR",
          totalStudents: 0,
          units: 0,
          labHours: 0,
          lectureHours: 0,
          labUnits: 0,
          lectureUnits: 0,
        },
      ],
      count: 0,
    };
  }
  handleDelete = (key: React.Key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    this.setState({ count: this.state.count + 1 });
    const newData: DataType = {
      key: this.state.count + 1,
      courseNo: " ",
      courseDescription: "DESCRIPTION",
      curricular: "CURRICULAR",
      totalStudents: 0,
      units: 0,
      labHours: 0,
      lectureHours: 0,
      labUnits: 0,
      lectureUnits: 0,
    };

    this.setState({
      dataSource: [...dataSource, newData],
    });
  };

  handleSave = (row: DataType) => {
    const { setGraduateTableData } = this.context;
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);

    newData.splice(index, 1, { ...row });
    // let item = newData[index];
    // item = {
    //   ...item,
    // };
    //

    // newData.splice(index, 1, {
    //   ...item,
    //   ...row,
    // });
    this.setState({ dataSource: newData });
    setGraduateTableData([...newData]);
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
