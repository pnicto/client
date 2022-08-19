import React, { useContext, useState } from "react";
import {
  globalContextInterface,
  globalStateInterface,
} from "../interfaces/interfaces";

const AppContext = React.createContext({});
type Props = {
  children: JSX.Element;
};

const AppProvider = ({ children }: Props) => {
  const [globalState, setGlobalState] = useState<globalStateInterface>({
    isLoading: true,
  } as globalStateInterface);

  return (
    <AppContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook which returns the context
const useGlobalContext = (): globalContextInterface => {
  return useContext(AppContext) as globalContextInterface;
};

export { useGlobalContext, AppProvider };
