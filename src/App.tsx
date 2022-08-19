import { useEffect } from "react";
import MainNavbar from "./components/MainNavbar";
import "normalize.css";
import "./App.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MainFooter from "./components/MainFooter";
import { useGlobalContext } from "./context/appContext";
import axios from "axios";
import { TasksboardInterface } from "./interfaces/interfaces";
import LoadingIndicator from "./components/misc/LoadingIndicator";
import Tasksboard from "./components/Taskboard";

export const theme = createTheme({
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
    const url = `${process.env.REACT_APP_BASE_URL}/taskboards`;
    const getResponse = await axios.get(url);
    const responseData: TasksboardInterface[] = getResponse.data;

    if (getResponse.status === 200) {
      // If there are no tasksboards in the database, create a tasksboard and set the state.
      if (responseData.length === 0) {
        const postResponse = await axios.post(url);
        const defaultTasksboard: TasksboardInterface = postResponse.data;
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
