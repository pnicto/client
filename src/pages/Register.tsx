import { Button, TextField } from "@mui/material";
import TaskRoundedIcon from "@mui/icons-material/TaskRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/appContext";
import AlertSnackbar from "../components/misc/AlertSnackbar";
import { useGoogleLogin } from "@react-oauth/google";
import { Google, GitHub } from "@mui/icons-material";
import { errorCodes } from "../interfaces/errors";

const Register = () => {
  // Loading state for the button
  const [isLoading, setIsLoading] = useState(false);
  const pageMode: "login" | "register" = useLocation().state ?? "login";
  const { globalDispatch, globalState } = useGlobalContext();

  // Refs
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const usernameRef = useRef<HTMLInputElement>();

  const navigate = useNavigate();

  useEffect(() => {
    // If logged in forcefully routes the user back to app
    if (globalState.isLoggedIn) {
      navigate("/app");
    }
  }, [globalState.isLoggedIn, navigate]);

  const handleFormSubmit = async () => {
    setIsLoading(true);

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const username = usernameRef.current?.value;

    // First add email and password to the body later add the username if the page mode is register
    if (!email && !password) {
      globalDispatch({
        type: "update snackbar",
        payload: {
          message: "Please provide the required details",
          severity: "error",
        },
      });
      setIsLoading(false);
      return;
    }

    const url = `${process.env.REACT_APP_BASE_URL}/user/${pageMode}`;

    let postBody: {
      email: string | undefined;
      password?: string;
      username?: string;
    } = {
      email,
      password,
    };

    // Update post body according to the pageMode and do basic validation for null fields
    if (pageMode === "register" && !username) {
      globalDispatch({
        type: "update snackbar",
        payload: {
          message: "Please provide the required details",
          severity: "error",
        },
      });
      return;
    }

    if (pageMode === "register" && username) {
      postBody = { ...postBody, username };
    }
    try {
      const postResponse = await axios.post(url, postBody);

      if (postResponse.status === 400) {
        globalDispatch({
          type: "update snackbar",
          payload: {
            message: "Please provide the required details",
            severity: "error",
          },
        });
        setIsLoading(false);
        return;
      }
      const { user } = postResponse.data;

      if (pageMode === "login" && postResponse.status === 200) {
        setIsLoading(false);
        // If login is successful, navigate to app
        navigate("/app");
        globalDispatch({
          type: "login user",
          payload: { user } as {
            user: { email: string; id: number; username: string };
          },
        });
        globalDispatch({
          type: "set session token",
          payload: postResponse.data.accessToken,
        });
        globalDispatch({
          type: "update snackbar",
          payload: {
            message: "Login successful",
            severity: "success",
          },
        });
      }

      if (pageMode === "register" && postResponse.status === 201) {
        setIsLoading(false);
        // If registration is successful, navigate to form/login
        navigate("/form", {
          state: "login",
        });
        globalDispatch({
          type: "update snackbar",
          payload: {
            severity: "success",
            message: "Registration successful. Please login to continue",
          },
        });

        if (passwordRef.current?.value) {
          passwordRef.current.value = "";
        }
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.code === errorCodes.badRequestError
      ) {
        const { msg } = error.response?.data as { msg: string };
        globalDispatch({
          type: "update snackbar",
          payload: {
            message: msg,
            severity: "error",
          },
        });
        setIsLoading(false);
      }
    }
  };

  // Login func for react-oauth pkg
  const login = useGoogleLogin({
    onSuccess: async (tokenRes) => {
      const url = `${process.env.REACT_APP_BASE_URL}/user/login`;
      const postResponse = await axios.post(url, {
        code: tokenRes.code,
      });
      
      if (postResponse.status === 200) {
        navigate("/app");
        globalDispatch({
          type: "login user",
          payload: { user: postResponse.data.user, hasUsedGoogleOauth: true },
        });
        globalDispatch({
          type: "update snackbar",
          payload: {
            message: "Login successful",
            severity: "success",
          },
        });
        globalDispatch({
          type: "set session token",
          payload: postResponse.data.accessToken,
        });
      }
    },
    flow: "auth-code",
    onError: (message) => {
      if (message) {
        globalDispatch({
          type: "update snackbar",
          payload: {
            severity: "error",
            message: "Give access to login",
          },
        });
      }
    },
    scope:
      "https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/calendar.events openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  });

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

          {
            // Render username field if the page mode is register
            pageMode === "register" && (
              <TextField
                inputRef={usernameRef}
                variant="outlined"
                label="Username"
                fullWidth
                size="small"
                className="login-field"
              />
            )
          }
          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            {pageMode ?? "Login"}
          </LoadingButton>

          {
            // Renders the oauth buttons if page mode is login
            pageMode === "login" && (
              <>
                <p>Or</p>
                <div id="btn-group">
                  <Button
                    onClick={() => login()}
                    variant="contained"
                    className="login-btn"
                  >
                    <Google />
                    Sign in with google
                  </Button>
                  <Button
                    href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&scope=user`}
                    variant="contained"
                    className="login-btn"
                  >
                    <GitHub />
                    Sign in with github
                  </Button>
                </div>
              </>
            )
          }
        </form>
      </div>
      <AlertSnackbar />
    </>
  );
};

export default Register;
