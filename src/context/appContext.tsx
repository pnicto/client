import axios from "axios";
import React, { useContext, useReducer } from "react";
import {
  globalContextInterface,
  globalStateInterface,
  TaskboardInterface,
  TaskcardInterface,
} from "../interfaces/interfaces";
import { reducer } from "./reducer";

const AppContext = React.createContext({});

type Props = {
  children: JSX.Element;
};

const AppProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: true,
    themeMode: "light",
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

  const fetchAllTaskscards = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/taskCards/${state.activeTasksboardId}`;
    const getResponse = await axios.get(url);
    const responseData: TaskcardInterface[] = getResponse.data;

    if (getResponse.status === 200) {
      //      setTaskcards(responseData);
      dispatch({
        type: "set taskcards",
        payload: responseData,
      });
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
  };
  const handleAddTaskcard = async (
    ref: React.MutableRefObject<HTMLInputElement | undefined>,
    setDialogState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const taskcardToBeAdded = ref.current?.value;
    if (taskcardToBeAdded) {
      const postBody = {
        cardTitle: taskcardToBeAdded,
      };
      const url = `${process.env.REACT_APP_BASE_URL}/taskCards/${state.activeTasksboardId}`;
      const postResponse = await axios.post(url, postBody);
      const newTaskcard = postResponse.data;
      // setTaskcards([...taskcards, newTaskcard]);
      dispatch({
        type: "add new taskcard",
        payload: newTaskcard,
      });

      setDialogState(false);
    } else {
      setDialogState(true);
    }
  };
  const changeTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch({
        type: "change theme",
        payload: "dark",
      });
    } else {
      dispatch({
        type: "change theme",
        payload: "light",
      });
    }
  };

  const handleClearAll = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/taskcards/clearTaskcards/${state.activeTasksboardId}`;
    await axios.delete(url);
    dispatch({
      type: "clear all taskcards",
    });
  };

  const deleteTaskcard = async (taskcardId: number) => {
    const url = `${process.env.REACT_APP_BASE_URL}/taskcards/${taskcardId}`;
    const deleteResponse = await axios.delete(url);
    dispatch({
      type: "delete taskcard",
      payload: taskcardId,
    });
    console.log(deleteResponse.data);
  };

  return (
    <AppContext.Provider
      value={{
        globalState: state,
        fetchAllTasksboards,
        changeActiveTaskboard,
        handleAddTaskboard,
        handleAddTaskcard,
        changeTheme,
        handleClearAll,
        fetchAllTaskscards,
        deleteTaskcard,
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
