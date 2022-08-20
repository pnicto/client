import axios from "axios";
import React, { useContext, useReducer } from "react";
import {
  globalContextInterface,
  globalStateInterface,
  TaskboardInterface,
} from "../interfaces/interfaces";
import { reducer } from "./reducer";

const AppContext = React.createContext({});

type Props = {
  children: JSX.Element;
};

const AppProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: true,
  } as globalStateInterface);
  // Function which fetches tasksboards from server and sets active tasksboard id and tasksboards in context.
  const fetchAllTasksboards = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/taskboards`;
    const getResponse = await axios.get(url);
    const responseData: TaskboardInterface[] = getResponse.data;

    if (getResponse.status === 200) {
      // If there are no tasksboards in the database, create a tasksboard and set the state.
      if (responseData.length === 0) {
        const postResponse = await axios.post(url);
        const defaultTasksboard: TaskboardInterface = postResponse.data;
        dispatch({
          type: "set taskboards",
          payload: {
            taskboards: [defaultTasksboard],
            activeTaskboardId: defaultTasksboard.id,
          },
        });
      } else {
        dispatch({
          type: "set taskboards",
          payload: {
            taskboards: responseData,
            activeTaskboardId: responseData[0].id,
          },
        });
      }
    }
  };

  const changeActiveTaskboard = (tasksboardId: number) => {
    dispatch({
      type: "change active taskboard",
      payload: tasksboardId,
    });
  };

  const handleAddTaskboard = async (
    ref: React.MutableRefObject<HTMLInputElement | undefined>,
    setDialogState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const newBoardTitle = ref.current?.value;
    if (newBoardTitle) {
      const postBody = {
        taskboardTitle: newBoardTitle,
      };
      const url = `${process.env.REACT_APP_BASE_URL}/taskboards`;
      const postResponse = await axios.post(url, postBody);
      const newTaskboard = postResponse.data;
      dispatch({
        type: "add new taskboard",
        payload: newTaskboard,
      });
      setDialogState(false);
    } else {
      setDialogState(true);
    }
    console.log(newBoardTitle);
  };

  return (
    <AppContext.Provider
      value={{
        globalState: state,
        fetchAllTasksboards,
        changeActiveTaskboard,
        handleAddTaskboard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook which returns the context
const useGlobalContext = (): globalContextInterface => {
  return useContext(AppContext) as globalContextInterface;
};

export { useGlobalContext, AppProvider };
