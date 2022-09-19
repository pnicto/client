import { Snackbar, TextField, AlertProps } from "@mui/material";
import TaskRoundedIcon from "@mui/icons-material/TaskRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import {  useRef, useState } from "react";
import axios from "axios";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/appContext";
import React from "react";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pageMode: "login" | "register" = useLocation().state ?? "login";
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const usernameRef = useRef<HTMLInputElement>();
  const { globalDispatch } = useGlobalContext();
  const navigate = useNavigate();
  const [snackbarState, setSnackbarState] = useState<{
    isOpen: boolean;
    message: string;
    severity: "danger" | "success" | "info";
  }>({
    isOpen: false,
    message: "",
    severity: "info",
  });

  const handleFormSubmit = async () => {
    setIsLoading(true);
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const username = usernameRef.current?.value;

    if (!email && !password) throw Error("Empty fields");
    let postBody: {
      email: string | undefined;
      password?: string;
      username?: string;
    } = {
      email,
      password,
    };
    const url = `${process.env.REACT_APP_BASE_URL}/user/${pageMode}`;
    if (pageMode === "register" && username) {
      postBody = { ...postBody, username };
    }
    const postResponse = await axios.post(url, postBody, {
      withCredentials: true,
    });

    const { user } = postResponse.data;

    if (pageMode === "login" && postResponse.status === 200 && user) {
      setIsLoading(false);
      navigate("/app");
      setSnackbarState({
        ...snackbarState,
        isOpen: true,
        message: "Login successful",
        severity: "success",
      });
      globalDispatch({
        type: "login user",
        payload: user as { email: string; id: number; username: string },
      });
    }

    if (pageMode === "register" && postResponse.status === 201) {
      setIsLoading(false);
      navigate("/form", {
        state: "login",
      });
      setSnackbarState({
        ...snackbarState,
        isOpen: true,
        severity: "success",
        message: "Registration successful. Please login to continue",
      });
    }
  };

  return (
    <div id="register">
      <form
        id="user-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleFormSubmit();
        }}
      >
        <div id="tasks-heading">
          <h1>TASKS</h1>
          <TaskRoundedIcon className="tasks-icon" />
        </div>
        <TextField
          inputRef={emailRef}
          type="email"
          variant="outlined"
          label="Email"
          fullWidth
          size="small"
          className="login-field"
          autoFocus
        />
        <TextField
          inputRef={passwordRef}
          variant="outlined"
          type="password"
          label="Password"
          fullWidth
          size="small"
          className="login-field"
        />
        {/* Render username field if the page mode is register */}
        {pageMode === "register" && (
          <TextField
            inputRef={usernameRef}
            variant="outlined"
            label="Username"
            fullWidth
            size="small"
            className="login-field"
          />
        )}
        <LoadingButton type="submit" variant="contained" loading={isLoading}>
          {pageMode ?? "Login"}
        </LoadingButton>
        <p>Or</p>
      </form>
      <div id="btn-group"></div>
      <Snackbar
        open={snackbarState.isOpen}
        autoHideDuration={4000}
        onClose={() => {
          setSnackbarState({ ...snackbarState, isOpen: false });
        }}
      >
        <Alert
          onClose={() => {
            setSnackbarState({ ...snackbarState, isOpen: false });
          }}
          severity={snackbarState.severity as AlertColor}
          sx={{ width: "100%" }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default Register;
