import { createContext, useContext, useEffect, useState } from "react";

export const DashContext = createContext({});

const useDash = () => useContext(DashContext) as any;

const DashProvider = ({ children }: any) => {
  const [idCloud, setIdCloud] = useState<any>();


  useEffect(() => {
    //getPatients();
  }, [idCloud]);

  return (
    <DashContext.Provider
      value={{ idCloud, setIdCloud }}
    >
      {children}
    </DashContext.Provider>
  );
};

export { DashProvider, useDash };
