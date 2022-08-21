import { createTheme, ThemeProvider } from "@mui/material/styles";
import "normalize.css";
import { useEffect } from "react";
import "./App.scss";
import MainFooter from "./components/MainFooter";
import MainNavbar from "./components/MainNavbar";
import LoadingIndicator from "./components/misc/LoadingIndicator";
import Tasksboard from "./components/Taskboard";
import { useGlobalContext } from "./context/appContext";

function App() {
  const { globalState, fetchAllTasksboards } = useGlobalContext();
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
