import React, { createContext, useMemo, useState } from "react";

interface ChildrenProps {
  children: React.ReactChildren | React.ReactChild;
}

export const UnsubscribeWorkloadContext = createContext<any>([]);

export const UnsubscribeWorkloadProvider: React.FC<ChildrenProps> = ({
  children,
}) => {
  const [listeners, setListeners] = useState<any>([]);

  const value = useMemo(
    () => ({
      listeners,
      setListeners,
    }),
    [listeners]
  );

  return (
    <UnsubscribeWorkloadContext.Provider value={value}>
      {children}
    </UnsubscribeWorkloadContext.Provider>
  );
};
