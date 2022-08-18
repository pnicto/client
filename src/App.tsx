import React, { useEffect, useState } from "react";
import MainNavbar from "./components/MainNavbar";
import "./App.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MainFooter from "./components/MainFooter";
import { useGlobalContext } from "./context/appContext";
import axios from "axios";
import { Tasksboard } from "./interfaces/interfaces";
import LoadingIndicator from "./components/LoadingIndicator";

const theme = createTheme({
  palette: {
    primary: { main: "#3385ff" },
    background: {
      default: "#f5faff",
    },
    secondary: {
      main: "#f5faff",
      contrastText: "rgb(31, 45, 51)",
    },
    text: {
      primary: "rgb(31, 45, 51)",
    },
  },
  shape: {
    borderRadius: 10,
  },
});

function App() {
  const { globalState, setGlobalState } = useGlobalContext();
  const { isLoading } = globalState;

  // Function which fetches tasksboards from server and sets active tasksboard id and tasksboards in context.
  const fetchAllTasksboards = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/tasksboards`;
    const response = await axios.get(url);
    const responseData: Tasksboard[] = response.data;

    if (response.status === 200) {
      // If there are no tasksboards in the database, create a tasksboard and set the state.
      if (responseData.length === 0) {
        const response = await axios.post(url);
        const defaultTasksboard: Tasksboard = response.data;
        setGlobalState({
          ...globalState,
          activeTasksboardId: defaultTasksboard.id,
          tasksboards: [defaultTasksboard],
          isLoading: false,
        });
      } else {
        setGlobalState({
          ...globalState,
          activeTasksboardId: responseData[0].id,
          tasksboards: responseData,
          isLoading: false,
        });
      }
    }
  };

  useEffect(() => {
    fetchAllTasksboards();
  }, []);

  console.log(isLoading);

  return (
    <ThemeProvider theme={theme}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <MainNavbar />
          <MainFooter />
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
