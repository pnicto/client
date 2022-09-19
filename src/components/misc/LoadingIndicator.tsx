import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/appContext";

const LoadingIndicator = () => {
  const { globalDispatch } = useGlobalContext();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user");

  useEffect(() => {
    if (!token && !user) {
      globalDispatch({
        type: "update snackbar",
        payload: {
          isOpen: true,
          message: "Invalid action. Please login/register to continue.",
          severity: "error",
        },
      });
      navigate("/form", {
        state: "login",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  return (
    <div id="loading-indicator">
      <CircularProgress color="primary" />
    </div>
  );
};

export default LoadingIndicator;
