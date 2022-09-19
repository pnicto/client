import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/appContext";

const LoadingIndicator = () => {
  const { globalState, globalDispatch } = useGlobalContext();
  const { user } = globalState;
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  if (!user || !token) {
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

  return (
    <div id="loading-indicator">
      <CircularProgress color="primary" />
    </div>
  );
};

export default LoadingIndicator;
