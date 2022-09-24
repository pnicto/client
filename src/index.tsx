import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./context/appContext";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <GoogleOAuthProvider
          clientId={process.env.REACT_APP_CLIENT_ID as string}
        >
          <App />
        </GoogleOAuthProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
