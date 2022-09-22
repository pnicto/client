import { TextField } from "@mui/material";
import TaskRoundedIcon from "@mui/icons-material/TaskRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useRef, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useGlobalContext } from "../context/appContext";
import AlertSnackbar from "../components/misc/AlertSnackbar";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pageMode: "login" | "register" = useLocation().state ?? "login";
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const usernameRef = useRef<HTMLInputElement>();
  const { globalDispatch, globalState } = useGlobalContext();

  const navigate = useNavigate();

  useEffect(() => {
    const handleCredentialResponse = async (
      response: google.accounts.id.CredentialResponse
    ) => {
      const { email, email_verified, name, iss } = jwt_decode(
        response.credential
      ) as {
        email: string;
        email_verified: string;
        name: string;
        iss: string;
      };

      if (email_verified) {
        const url = `${process.env.REACT_APP_BASE_URL}/user/${pageMode}`;
        const postBody = {
          email,
          username: name,
          iss,
        };

        let postResponse: AxiosResponse<any, any>;
        switch (pageMode) {
          case "login":
            postResponse = await axios.post(url, postBody);
            if (postResponse.status === 200) {
              globalDispatch({
                type: "login user",
                payload: postResponse.data.user as {
                  email: string;
                  id: number;
                  username: string;
                },
              });
              globalDispatch({
                type: "set session token",
                payload: postResponse.data.accessToken,
              });
              navigate("/app");
              globalDispatch({
                type: "update snackbar",
                payload: {
                  isOpen: true,
                  message: "Login successful",
                  severity: "success",
                },
              });
            }
            break;
          case "register":
            postResponse = await axios.post(url, postBody);
            if (postResponse.status === 201) {
              navigate("/form", {
                state: "login",
              });
              globalDispatch({
                type: "update snackbar",
                payload: {
                  isOpen: true,
                  severity: "success",
                  message: "Registration successful. Please login to continue",
                },
              });
            }

            break;
        }
      }
    };

    if (globalState.isLoggedIn) {
      navigate("/app");
      globalDispatch({
        type: "update snackbar",
        payload: {
          isOpen: true,
          message: "Login successful",
          severity: "success",
        },
      });
    }

    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_CLIENT_ID as string,
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("btn-group") as HTMLElement,
      {
        theme: "filled_blue",
        type: "standard",
        text: pageMode === "register" ? "signup_with" : "signin_with",
        shape: "rectangular",
      }
    );
    google.accounts.id.prompt();
  }, [globalDispatch, globalState.isLoggedIn, navigate, pageMode]);

  const handleFormSubmit = async () => {
    setIsLoading(true);
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const username = usernameRef.current?.value;

    if (!email && !password) {
      globalDispatch({
        type: "update snackbar",
        payload: {
          isOpen: true,
          message: "Please provide the required details",
          severity: "error",
        },
      });
    }
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
    } else {
      globalDispatch({
        type: "update snackbar",
        payload: {
          isOpen: true,
          message: "Please provide the required details",
          severity: "error",
        },
      });
    }
    const postResponse = await axios.post(url, postBody);

    const { user } = postResponse.data;

    if (pageMode === "login" && postResponse.status === 200 && user) {
      setIsLoading(false);
      navigate("/app");
      globalDispatch({
        type: "login user",
        payload: user as { email: string; id: number; username: string },
      });
      globalDispatch({
        type: "set session token",
        payload: postResponse.data.accessToken,
      });
      globalDispatch({
        type: "update snackbar",
        payload: {
          isOpen: true,
          message: "Login successful",
          severity: "success",
        },
      });
    }

    if (pageMode === "register" && postResponse.status === 201) {
      setIsLoading(false);
      navigate("/form", {
        state: "login",
      });
      globalDispatch({
        type: "update snackbar",
        payload: {
          isOpen: true,
          severity: "success",
          message: "Registration successful. Please login to continue",
        },
      });
    }
  };

  return (
    <>
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
      </div>
      <AlertSnackbar />
    </>
  );
};

export default Register;
