import { Button } from "@mui/material";
import { useGlobalContext } from "../context/appContext";

const MainFooter = () => {
  const { globalState, setGlobalState } = useGlobalContext();
  const { tasksboards, activeTasksboardId } = globalState;

  const changeActiveTasksboard = (tasksboardId: number) => {
    setGlobalState({ ...globalState, activeTasksboardId: tasksboardId });
  };

  return (
    <div id="main-footer">
      {tasksboards.map((tasksboard) => {
        // Scale the button which shows the active tasksboard.
        if (activeTasksboardId === tasksboard.id) {
          return (
            <Button
              key={tasksboard.id}
              variant="contained"
              color="secondary"
              className="active"
              onClick={() => changeActiveTasksboard(tasksboard.id)}
            >
              {tasksboard.boardTitle}
            </Button>
          );
        } else {
          return (
            <Button
              key={tasksboard.id}
              variant="contained"
              color="secondary"
              onClick={() => changeActiveTasksboard(tasksboard.id)}
            >
              {tasksboard.boardTitle}
            </Button>
          );
        }
      })}
    </div>
  );
};

export default MainFooter;
