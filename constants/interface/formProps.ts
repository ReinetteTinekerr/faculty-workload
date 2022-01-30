interface ResearchOrProductionProps {
  title: string;
  date: [any, any];
  role: string;
  units: number;
}

export interface WorkloadDataProps {
  id?: string | any;
  createdAt?: any;
  name: string;
  semester: string;
  schoolYear: [string, string];
  baccalaureate: string;
  masteral: string;
  doctorate: string;
  campus: string;
  college: string;
  research: [ResearchOrProductionProps];
  production: [ResearchOrProductionProps];
  undergraduate?: any;
  graduate?: any;
  position: string;
  graduateSumCreditUnits?: number;
  undergraduateSumFTE?: number;
  totalFacultyWorkload?: number;
  researchUnitsSum?: number;
  excessFacultyWorkload?: number;
  extensionProductionSum?: number;
}

export interface WorkloadToUploadProps {
  workload: WorkloadDataProps;
  createdAt: any;
  validators: [any];
  validationProgress: number;
  id: string;
}

export interface UndergraduateDataProps {
  key?: React.Key;
  id?: string;
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

export interface GraduateDataProps {
  courseDescription: string;
  courseNo: string;
  curricularProg: string;
  labContactHrs: string;
  lecContactHrs: string;
  labCreditUnits: string;
  lecCreditUnits: string;
  totalStudents: string;
  units: string;
}

export interface UserProfileProps {
  userData?: {
    baccalaureate: string | undefined;
    campus: string;
    campusId: string;
    college: string;
    department: string;
    doctorate: string;
    email: string;
    masteral: string;
    password: string;
    position: string;
    role: string;
    uid: string;
    username: string;
    signature: string;
  };
}

export interface CampusProps {
  campus: string;
  members: [any];
  timestamp: any;
  validators: [any];
}
