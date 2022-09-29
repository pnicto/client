import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/appContext";

const GithubOauthWaitPage = () => {
  const navigate = useNavigate();
  const { globalDispatch } = useGlobalContext();

  useEffect(() => {
    const code = document.URL.split("code=")?.[1];
    const githubOauth = async () => {
      const postResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/github/auth`,
        {
          code,
        }
      );
      if (postResponse.status === 200) {
        globalDispatch({
          type: "login user",
          payload: {
            user: postResponse.data,
          },
        });

        globalDispatch({
          type: "update snackbar",
          payload: {
            message: "Login successful",
            severity: "success",
          },
        });

        navigate("/app");
      }
    };

    if (code) {
      githubOauth();
    } else {
      console.log("kys");
    }
  }, [globalDispatch, navigate]);

  return (
    <div id="loading-indicator">
      <CircularProgress color="info" />
    </div>
  );
};

export default GithubOauthWaitPage;
