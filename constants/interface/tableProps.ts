export interface UndergraduateProps {
  key: string;
  courseCode: string;
  descriptiveTitle: string;
  subjectLabel: string;
  programYearLevel: string;
  units: string;
  lectureHours: number;
  labHours: number;
  schedule: string;
  totalStudents: number;
  rooms: string;
  lectureFTE: number;
  labFTE: number;
  totalFTE: number;
}

export interface GraduateProps {
  key: string;
  courseNo: string;
  courseDescription: string;
  curricular: number;
  totalStudents: number;
  units: number;
  lectureHours: number;
  labHours: number;
  lectureUnits: number;
  labUnits: number;
}
