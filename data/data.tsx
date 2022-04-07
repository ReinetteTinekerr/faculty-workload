export const summaryColumns = [
  {
    title: "College",
    dataIndex: "college",
    key: "college",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Total Workloads",
    dataIndex: "totalFacultyWorkload",
    key: "totalFacultyWorkload",
  },
  {
    title: "Excess Workloads",
    dataIndex: "excessFacultyWorkload",
    key: "excessFacultyWorkload",
  },
];

export const undergraduateColumns = [
  {
    title: "SUBJECT / COURCE CODE",
    dataIndex: "courseCode",
    key: "name",
    render: (text: string) => {
      console.log("again");

      return <div>{text.toUpperCase()}</div>;
    },
    width: 50,
  },
  {
    title: "DESCRIPTIVE TITLE",
    dataIndex: "descriptiveTitle",
    // width: 80,
    // render: (text: string) => <div>{toTitleCase(text)}</div>,
    key: "age",
  },
  {
    title: "REGULAR / UNPROG SUBJECT",
    dataIndex: "subjectLabel",
    key: "subjectLabel",
    render: (text: string) => <div>{text.toUpperCase()}</div>,
    width: 60,
  },
  {
    title: "PROGRAM YEAR LEVEL",
    key: "programYearLevel",
    dataIndex: "programYearLevel",
    render: (text: string) => <div>{text.toUpperCase()}</div>,
    width: 60,
  },
  {
    title: "UNITS",
    key: "units",
    width: 35,
    dataIndex: "units",
  },

  // {
  //   title: "LEC HRS",
  //   key: "lecHrs",
  //   width: 35,
  //   dataIndex: "units",
  // },

  // {
  //   title: "LAB HRS",
  //   key: "labHrs",
  //   width: 35,
  //   dataIndex: "units",
  // },
  {
    title: "NO. OF HOURS",
    children: [
      {
        title: "LEC",
        dataIndex: "lecHours",
        key: 1,
        width: 25,
      },
      {
        title: "LAB",
        dataIndex: "labHours",
        width: 25,
        key: 2,
      },
    ],
  },
  {
    title: "SCHEDULE",
    dataIndex: "schedule",
    key: "schedule",
    width: 70,
    render: (text: string) => <div>{text.toUpperCase()}</div>,
  },
  {
    title: "NO. OF STUDENTS",
    dataIndex: "totalStudents",
    key: "students",
    width: 30,
  },
  {
    title: "ROOMS",
    dataIndex: "rooms",
    key: "address",
    width: 70,
    render: (text: string) => <div>{text.toUpperCase()}</div>,
  },

  {
    title: "FTE",
    children: [
      {
        title: "LEC",
        dataIndex: "lecFTE",
        // width: 25,
        key: 1,
      },
      {
        title: "LAB",
        dataIndex: "labFTE",
        // width: 25,
        key: 2,
      },
    ],
  },
  { title: "TOTAL FTE", dataIndex: "totalFTE", key: "total", width: 25 },
];

export const undergraduateData = [
  {
    key: "1",
    courseCode: "CS 411",
    descriptiveTitle: "CS Thesis Writing 2",
    subjectLabel: "REGULAR",
    programYearLevel: "BSCS 4A",
    units: "3",
    lecHours: 2,
    labHours: 3,
    schedule: "MON 6-10 WED 7-10",
    totalStudents: 45,
    rooms: "ITRM 104 / RMBLAB 104",
    lectureFTE: 2,
    labFTE: 3,
    totalFTE: 5,
  },
  // {
  //   key: "2",
  //   courseCode: "CS 411",
  //   descriptiveTitle: "CS Thesis Writing 2",
  //   subjectLabel: "REGULAR",
  //   programYearLevel: "BSCS 4B",
  //   units: "3",
  //   lectureHours: 2,
  //   labHours: 3,
  //   schedule: "MON 6-10 WED 7-10",
  //   totalStudents: 45,
  //   rooms: "ITRM 104 / RMBLAB 104",
  //   lectureFTE: 2,
  //   labFTE: 3,
  //   totalFTE: 5,
  // },
  // {
  //   key: "3",
  //   courseCode: "IT 314",
  //   descriptiveTitle: "Information Assurance and Security 1",
  //   subjectLabel: "REGULAR",
  //   programYearLevel: "BSIT 3A BPO",
  //   units: "3",
  //   lectureHours: 2,
  //   labHours: 3,
  //   schedule: "MON 6-10 WED 7-10",
  //   totalStudents: 45,
  //   rooms: "ITRM 104 / RMBLAB 104",
  //   lectureFTE: 2,
  //   labFTE: 3,
  //   totalFTE: 5,
  // },
  // {
  //   key: "4",
  //   courseCode: "IT 314",
  //   descriptiveTitle: "Information Assurance and Security 1",
  //   subjectLabel: "REGULAR",
  //   programYearLevel: "BSIT 3A BA",
  //   units: "3",
  //   lectureHours: 2,
  //   labHours: 3,
  //   schedule: "MON 6-10 WED 7-10",
  //   totalStudents: 45,
  //   rooms: "ITRM 104 / RMBLAB 104",
  //   lectureFTE: 2,
  //   labFTE: 3,
  //   totalFTE: 5,
  // },
];

export const graduateColumns = [
  {
    title: "Course No.",
    dataIndex: "courseNo",
    key: "courseNo",
    // render: (text: string) => <a>{text}</a>,
    render: (text: string) => <div>{text.toUpperCase()}</div>,
    // width: 60,
  },
  {
    title: "Course Description",
    dataIndex: "courseDescription",
    width: 200,
    // render: (text: string) => <div>{toTitleCase(text)}</div>,
    key: "description",
  },
  {
    title: "Curricular Program and Year Level",
    dataIndex: "curricularProg",
    width: 110,
    render: (text: string) => <div>{text.toUpperCase()}</div>,
    key: "curricularProg",
  },
  {
    title: "No. Of Students",
    dataIndex: "totalStudents",
    // width: 50,
    key: "totalStudents",
  },
  {
    title: "Units",
    dataIndex: "units",
    // width: 50,
    key: "units",
  },
  {
    title: "Contact Hrs/wk",
    key: "contactHrsWk",
    children: [
      {
        title: "LEC",
        dataIndex: "lecContactHrs",
        key: 1,
        // width: 25,
      },
      {
        title: "LAB",
        dataIndex: "labContactHrs",
        // width: 25,
        key: 2,
      },
    ],
  },

  {
    title: "Credit Units",
    key: "creditUnits",
    children: [
      {
        title: "LEC",
        dataIndex: "lecCreditUnits",
        key: 1,
        // width: 20,
      },
      {
        title: "LAB",
        dataIndex: "labCreditUnits",
        // width: 20,
        key: 2,
      },
    ],
  },

  // {
  //   title: "operation",
  //   dataIndex: "operation",
  //   render: (_: any, record: { key: React.Key }) =>
  //     graduateData.length >= 1 ? (
  //       <Popconfirm
  //         title="Sure to delete?"
  //         // onConfirm={() => handleDelete(record.key)}
  //       >
  //         <a>Delete</a>
  //       </Popconfirm>
  //     ) : null,
  // },
];

export const graduateData = [
  {
    key: "1",
    courseNo: "DIT 401",
    courseDescription: "Advanced Software Engineering",
    curricular: "DIT 1",
    totalStudents: 9,
    units: 3,
    lectureHours: 2,
    labHours: 3,
    lectureUnits: 2,
    labUnits: 1,
  },
];
