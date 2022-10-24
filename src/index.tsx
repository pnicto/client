import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./context/appContext";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AxiosInterceptor from "./components/misc/AxiosInterceptor";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AxiosInterceptor>
        <AppProvider>
          <GoogleOAuthProvider
            clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID as string}
          >
            <App />
          </GoogleOAuthProvider>
        </AppProvider>
      </AxiosInterceptor>
    </BrowserRouter>
  </React.StrictMode>
);
