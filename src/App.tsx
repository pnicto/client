import { createTheme, ThemeProvider } from "@mui/material/styles";
import "normalize.css";
import { useEffect } from "react";
import "./App.scss";
import MainFooter from "./components/MainFooter";
import MainNavbar from "./components/MainNavbar";
import LoadingIndicator from "./components/misc/LoadingIndicator";
import Tasksboard from "./components/Taskboard";
import { useGlobalContext } from "./context/appContext";

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
  const { globalState, fetchAllTasksboards } = useGlobalContext();

  const { isLoading } = globalState;

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
