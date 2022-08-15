import React from "react";
import MainNavbar from "./components/MainNavbar";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MainFooter from "./components/MainFooter";

const theme = createTheme({
  palette: {
    primary: { main: "#3385ff" },
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
