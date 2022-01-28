import { ActiveComponent } from "constants/enums/activeComponent";
import { WorkloadDataProps } from "constants/interface/formProps";
import { createContext, Dispatch, SetStateAction, useState } from "react";

interface ChildrenProps {
  children: React.ReactChildren | React.ReactChild;
}

interface ActiveComponentProps {
  activeComponent: ActiveComponent;
  setActiveComponent: Dispatch<SetStateAction<ActiveComponent>>;
  selectedItem: any;
  setSelectedItem: Dispatch<SetStateAction<WorkloadDataProps | null>>;
}

export const ActiveComponentContext = createContext<
  ActiveComponentProps | undefined
>(undefined);

export const ActiveComponentProvider: React.FC<ChildrenProps> = ({
  children,
}) => {
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>(
    ActiveComponent.WorkloadIndex
  );
  const [selectedItem, setSelectedItem] = useState<WorkloadDataProps | null>(
    null
  );
  return (
    <ActiveComponentContext.Provider
      value={{
        activeComponent,
        setActiveComponent,
        selectedItem,
        setSelectedItem,
      }}
    >
      {children}
    </ActiveComponentContext.Provider>
  );
};
