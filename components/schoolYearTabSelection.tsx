import { getCurrentSchoolYear, getDecrementedSchoolYear } from "utils/utils";
import { Select, Typography } from "antd";

const { Option } = Select;
const { Text } = Typography;

export function SchoolYearTabSelection({
  selectedSchoolYear,
  setSelectedSchoolYear,
}: any) {
  const schoolYear = getCurrentSchoolYear();
  return (
    <>
      <Text strong> School Year:</Text>{" "}
      <Select
        showSearch
        onSelect={(value) => {
          console.log(value);
          setSelectedSchoolYear(value);
          localStorage.setItem("schoolYear", value.toString());
        }}
        style={{ width: "120px" }}
        placeholder="Type to select"
        optionFilterProp="children"
        defaultValue={!selectedSchoolYear ? schoolYear : selectedSchoolYear}
        filterOption={(input, option: any) => {
          return (
            option?.children
              ?.toString()
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          );
        }}
        filterSort={(optionA, optionB) =>
          optionB.children
            .toLowerCase()
            .localeCompare(optionA.children.toLowerCase())
        }
      >
        {[...new Array(10).keys()].map((_: any, i: number) => {
          return (
            <Option key={i} value={getDecrementedSchoolYear(schoolYear, i)}>
              {getDecrementedSchoolYear(schoolYear, i)}
            </Option>
          );
        })}
      </Select>
    </>
  );
}
