import React from "react";
import MainNavbar from "./components/MainNavbar";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MainFooter from "./components/MainFooter";

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
  return (
    <ThemeProvider theme={theme}>
      <>
        <MainNavbar />
        <MainFooter />
      </>
    </ThemeProvider>
  );
}

export default App;
