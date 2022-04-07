import { Collapse, Empty, Typography } from "antd";
import { DropdownSchoolYearAndSemester } from "./schoolYearAndSemesterDropdown";
import { WorkloadList } from "./WorkloadList";

const { Panel } = Collapse;
const { Title } = Typography;

interface WorkloadsTabProps {
  selectedSchoolYear: string;
  setSelectedSchoolYear: any;
  selectedSemester: string;
  setSelectedSemester: any;
  groupByCollegeWorkloads: { string: [any] };
  selectedCollege: string;
  setSelectedCollege: any;
  userRole: string;
  userData: any;
}

export function WorkloadsTab({
  groupByCollegeWorkloads,
  selectedCollege,
  selectedSchoolYear,
  setSelectedCollege,
  setSelectedSchoolYear,
  userData,
  userRole,
  selectedSemester,
  setSelectedSemester,
}: WorkloadsTabProps) {
  return (
    <>
      <DropdownSchoolYearAndSemester
        selectedSchoolYear={selectedSchoolYear}
        setSelectedSchoolYear={setSelectedSchoolYear}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
      />
      <div style={{ height: "10px" }}></div>
      {Object.keys(groupByCollegeWorkloads).length > 0 ? (
        <Collapse
          style={{ width: "90%", margin: "auto" }}
          defaultActiveKey={[selectedCollege]}
          accordion
          onChange={(value) => {
            console.log("collapse", value);
            setSelectedCollege(value ? value.toString() : "");
            localStorage.setItem("college", value ? value.toString() : "");
          }}
        >
          {Object.entries(groupByCollegeWorkloads).map(([key, value]) => {
            return (
              <Panel
                header={<Title level={5}>{key}</Title>}
                extra={`Total: ${value.length}`}
                key={key}
              >
                <WorkloadList
                  userRole={userRole}
                  userPositionIndex={userData.positionIndex}
                  workloads={value}
                  selectedSemester={selectedSemester}
                  setSelectedSemester={setSelectedSemester}
                />
              </Panel>
            );
          })}
        </Collapse>
      ) : (
        <Empty></Empty>
      )}
    </>
  );
}
