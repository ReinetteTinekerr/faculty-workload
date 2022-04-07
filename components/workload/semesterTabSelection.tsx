import { Select, Typography } from "antd";
import { getCurrentSemester } from "utils/utils";

const { Option } = Select;
const { Text } = Typography;

export function SemesterTabSelection({
  selectedSemester,
  setSelectedSemester,
}: any) {
  const currentSemester = getCurrentSemester();
  return (
    <>
      <Text strong> Semester:</Text>{" "}
      <Select
        // showSearch
        onSelect={(value) => {
          console.log(value);
          setSelectedSemester(value);
          localStorage.setItem("semester", value.toString());
        }}
        style={{ width: "120px" }}
        placeholder="Type to select"
        optionFilterProp="children"
        defaultValue={!selectedSemester ? currentSemester : selectedSemester}
      >
        <Option key={"first"} value={"First Semester"}>
          First
        </Option>
        <Option key={"second"} value={"Second Semester"}>
          Second
        </Option>
        <Option key={"summer"} value={"Summer"}>
          Mid Year
        </Option>
      </Select>
    </>
  );
}
