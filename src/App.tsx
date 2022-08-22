import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import "normalize.css";
import { useEffect } from "react";
import "./App.scss";
import MainFooter from "./components/MainFooter";
import MainNavbar from "./components/MainNavbar";
import LoadingIndicator from "./components/misc/LoadingIndicator";
import Tasksboard from "./components/Taskboard";
import { useGlobalContext } from "./context/appContext";
import { TaskboardInterface } from "./interfaces/interfaces";

function App() {
  const { globalState, globalDispatch } = useGlobalContext();
  const { isLoading, themeMode } = globalState;

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
        globalDispatch({
          type: "set taskboards",
          payload: {
            taskboards: [defaultTasksboard],
            activeTaskboardId: defaultTasksboard.id,
          },
        });
      } else {
        globalDispatch({
          type: "set taskboards",
          payload: {
            taskboards: responseData,
            activeTaskboardId: responseData[0].id,
          },
        });
      }
    }
  };

  useEffect(() => {
    fetchAllTasksboards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <MainNavbar />
          <Tasksboard />
          <MainFooter />
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
