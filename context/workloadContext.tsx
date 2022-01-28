import { WorkloadDataProps } from "constants/interface/formProps";
import React, { createContext, useMemo, useState } from "react";

interface WorkloadContextProps {
  formData?: WorkloadDataProps[] | [];
  setFormData?: any;
}

interface ChildrenProps {
  children: React.ReactChildren | React.ReactChild;
}

const WorkloadContext = createContext<WorkloadContextProps>([
  [],
  () => [],
] as WorkloadContextProps);

export const WorkloadProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [formData, setFormData] = useState<WorkloadDataProps[] | []>([]);

  const value = useMemo(
    () => ({
      formData,
      setFormData,
    }),
    [formData]
  );

  return (
    <WorkloadContext.Provider value={value}>
      {children}
    </WorkloadContext.Provider>
  );
};

export default WorkloadContext;
