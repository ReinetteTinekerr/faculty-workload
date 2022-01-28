import {
  GraduateProps,
  UndergraduateProps,
} from "constants/interface/tableProps";
import { createContext, useMemo, useState } from "react";

export interface TableContextProps {
  undergraduateTableData: UndergraduateProps[] | Array<any>;
  setUndergraduateTableData: any;

  graduateTableData: GraduateProps[] | Array<any>;
  setGraduateTableData: any;
}

interface ChildrenProps {
  children: React.ReactChildren | React.ReactChild;
}

const TableDataContext = createContext<TableContextProps | null>(null);

export const TableDataProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [graduateTableData, setGraduateTableData] = useState<
    GraduateProps[] | []
  >([]);
  const [undergraduateTableData, setUndergraduateTableData] = useState<
    UndergraduateProps[] | []
  >([]);

  const value = useMemo(
    () => ({
      graduateTableData,
      setGraduateTableData,
      undergraduateTableData,
      setUndergraduateTableData,
    }),
    [graduateTableData, undergraduateTableData]
  );

  return (
    <TableDataContext.Provider value={value}>
      {children}
    </TableDataContext.Provider>
  );
};

export default TableDataContext;
