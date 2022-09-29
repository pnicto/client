import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/appContext";
import { TaskboardInterface } from "../interfaces/interfaces";
import MainFooter from "./MainFooter";
import MainNavbar from "./MainNavbar";
import AlertSnackbar from "./misc/AlertSnackbar";
import Taskboard from "./Taskboard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoadingIndicator from "./misc/LoadingIndicator";

const MainApp = () => {
  const { globalState, globalDispatch } = useGlobalContext();
  const { isLoading, isLoggedIn, themeMode } = globalState;
  const navigate = useNavigate();
  const theme = createTheme({
    palette: {
      mode: themeMode,
      ...(themeMode === "light"
        ? {
            primary: { main: "#3385ff" },
            background: {
              default: "hsl(210, 100%, 98%)",
              paper: "hsl(210, 100%, 98%)",
            },
            secondary: {
              main: "#f5faff",
              contrastText: "rgb(31, 45, 51)",
            },
            text: {
              primary: "rgb(31, 45, 51)",
            },
          }
        : {
            primary: {
              main: "#f5faff",
            },
            secondary: {
              main: "#1f2d33",
            },
            background: {
              default: "#1f2d33",
              paper: "#1f2d33",
            },
            text: {
              primary: "#f5faff",
            },
          }),
    },
    shape: {
      borderRadius: 8,
    },
  });
  useEffect(() => {
    const fetchAllTasksboards = async () => {
      const url = `${process.env.REACT_APP_API_URL}/taskboards`;
      const getResponse = await axios.get(url);
      const responseData: {
        userTaskboards: TaskboardInterface[];
        sharedTaskboards: TaskboardInterface[];
      } = getResponse.data;

      if (getResponse.status === 200) {
        // If there are no tasksboards in the database, create a tasksboard and set the state.
        if (responseData.userTaskboards.length === 0) {
          const postResponse = await axios.post(url);
          const defaultTasksboard: TaskboardInterface = postResponse.data;
          globalDispatch({
            type: "set taskboards",
            payload: {
              taskboards: {
                userTaskboards: [defaultTasksboard],
              },
              activeTaskboardId: defaultTasksboard.id,
            },
          });
        } else {
          globalDispatch({
            type: "set taskboards",
            payload: {
              taskboards: responseData,
              activeTaskboardId: responseData.userTaskboards[0].id,
            },
          });
        }
      }
    };

    if (isLoading) {
      fetchAllTasksboards();
    }
  }, [globalDispatch, isLoading, isLoggedIn, navigate]);

  return (
    <>
      <ThemeProvider theme={theme}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <MainNavbar />
            <Taskboard />
            <MainFooter />
            <AlertSnackbar />
          </>
        )}
      </ThemeProvider>
    </>
  );
};

export default MainApp;
