import { TextField } from "@mui/material";
import TaskRoundedIcon from "@mui/icons-material/TaskRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pageMode: "login" | "register" = useLocation().state;
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const usernameRef = useRef<HTMLInputElement>();

  const handleFormSubmit = async () => {
    setIsLoading(true);
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email && !password) throw Error("Empty fields");
    let postBody: {
      email: string | undefined;
      password: string | undefined;
      username?: string;
    } = {
      email,
      password,
    };
    const url = `${process.env.REACT_APP_BASE_URL}/user/${pageMode}`;
    if (pageMode === "register") {
      const username = usernameRef.current?.value;
      if (!username) return;
      postBody = { ...postBody, username };
    }
    const { accessToken } = await (await axios.post(url, postBody)).data;
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
        {/* Render username field if the page mode is register */}
        {pageMode === "register" && (
          <TextField
            inputRef={usernameRef}
            variant="outlined"
            label="Username"
            fullWidth
            size="small"
            className="login-field"
            autoFocus
          />
        )}
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

        <LoadingButton type="submit" variant="contained" loading={isLoading}>
          {pageMode}
        </LoadingButton>
      </form>
    </div>
  );
};

export default Register;
