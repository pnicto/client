import { Button, IconButton } from "@mui/material/";
import { MoreHoriz, MoreVert } from "@mui/icons-material";
import { useGlobalContext } from "../context/appContext";

const MainNavbar = () => {
  const { globalState } = useGlobalContext();
  const { activeTasksboardId, tasksboards } = globalState;
  const activeTasksboard = tasksboards.find(
    (tasksboard) => tasksboard.id === activeTasksboardId
  );

  return (
    <nav id="main-navbar">
      <div id="board-title">
        <h3>{activeTasksboard?.boardTitle}</h3>
        <IconButton aria-label="more board actions">
          <MoreVert />
        </IconButton>
      </div>
      <div id="nav-button-group">
        <Button variant="contained">clear current</Button>
        <Button variant="contained">export</Button>
        <IconButton aria-label="more actions">
          <MoreHoriz />
        </IconButton>
      </div>
    </nav>
  );
};

export default MainNavbar;
