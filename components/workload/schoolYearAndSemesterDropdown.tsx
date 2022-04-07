import { SchoolYearTabSelection } from "./schoolYearTabSelection";
import { SemesterTabSelection } from "./semesterTabSelection";

interface DropdownSchoolYearAndSemesterProps {
  selectedSchoolYear: string;
  setSelectedSchoolYear: any;
  selectedSemester: string;
  setSelectedSemester: any;
}

export function DropdownSchoolYearAndSemester({
  selectedSchoolYear,
  selectedSemester,
  setSelectedSchoolYear,
  setSelectedSemester,
}: DropdownSchoolYearAndSemesterProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "right",
        alignItems: "center",
      }}
    >
      <SchoolYearTabSelection
        selectedSchoolYear={selectedSchoolYear}
        setSelectedSchoolYear={setSelectedSchoolYear}
      />
      <div
        style={{
          width: "10px",
        }}
      ></div>
      <SemesterTabSelection
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
      />
    </div>
  );
}
