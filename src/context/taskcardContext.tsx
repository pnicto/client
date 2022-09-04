import React, { useContext } from "react";
import {
  taskcardContextInterface,
  TaskitemInterface,
} from "../interfaces/interfaces";

type Props = {
  children: JSX.Element;
  tasks: TaskitemInterface[];
  setTasks: React.Dispatch<React.SetStateAction<TaskitemInterface[]>>;
};
const taskcardContext = React.createContext({});

const TaskcardProvider = ({ children, tasks, setTasks }: Props) => {
  return (
    <taskcardContext.Provider value={{ tasks, setTasks }}>
      {children}
    </taskcardContext.Provider>
  );
};
const useTaskcardContext = (): taskcardContextInterface => {
  return useContext(taskcardContext) as taskcardContextInterface;
};
export { useTaskcardContext, TaskcardProvider };
