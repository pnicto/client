import { ReactComponent as LandingTasksSvg } from "../assets/landingTasks.svg";
import TaskRoundedIcon from "@mui/icons-material/TaskRounded";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import AlertSnackbar from "../components/misc/AlertSnackbar";

const Landing = () => {
  return (
    <>
      <div id="landing-page">
        <div id="tasks-heading">
          <h1>TASKS</h1>
          <TaskRoundedIcon className="tasks-icon" />
        </div>
        <LandingTasksSvg id="tasks-svg" />
        <Button variant="contained">
          <Link to="/form" className="btn-link" state={"register"}>
            Register
          </Link>
        </Button>
        <p>
          Already a user?{" "}
          <Link to={"/form"} state={"login"}>
            Login
          </Link>
        </p>
      </div>
      <AlertSnackbar />
    </>
  );
};

export default Landing;
