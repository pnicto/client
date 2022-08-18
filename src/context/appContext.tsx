import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { backendUrlTasksboards } from "../constants";
import { globalContextInterface, Tasksboard } from "../interfaces/interfaces";

const AppContext = React.createContext({});
type Props = {
  children: JSX.Element;
};

const AppProvider = ({ children }: Props) => {
  const [state, setState] = useState<globalContextInterface | {}>({});
  useEffect(() => {
    const fetchAllTasksboards = async () => {
      const response = await axios.get(backendUrlTasksboards);
      const data: Tasksboard[] = response.data;
      if (response.status === 200) {
        if (data.length === 0) {
          const response = await axios.post(backendUrlTasksboards);
          const defaultTasksboard: Tasksboard = response.data;
          setState({ ...state, activeTasksboardId: defaultTasksboard.id });
        } else {
          setState({ ...state, activeTasksboardId: data[0].id });
        }
      }
    };
    fetchAllTasksboards();
  }, []);
  return (
    <>
      <AppContext.Provider value={{ ...state }}>{children}</AppContext.Provider>
    </>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
