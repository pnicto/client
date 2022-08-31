import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Paper,
} from "@mui/material/";
import { MoreHoriz, MoreVert } from "@mui/icons-material";
import { useGlobalContext } from "../context/appContext";
import React, { useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import AlertDialog from "./dialogs/AlertDialog";
import axios from "axios";
import OptionsMenu from "./menus/OptionsMenu";

const MainNavbar = () => {
  const taskboardRef = useRef<HTMLInputElement>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { globalState, globalDispatch } = useGlobalContext();
  const { activeTaskboardId, tasksboards } = globalState;
  const [isChecked, setIsChecked] = useState(false);
  const activeTasksboard = tasksboards.find(
    (tasksboard) => tasksboard.id === activeTaskboardId
  );

  const changeTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      globalDispatch({
        type: "change theme",
        payload: "dark",
      });
    } else {
      globalDispatch({
        type: "change theme",
        payload: "light",
      });
    }
  };

  const handleClearAll = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/taskcards/clearTaskcards/${activeTaskboardId}`;
    await axios.delete(url);
    globalDispatch({
      type: "clear all taskcards",
    });
  };

  // Functions that handle the menu from MUI docs.
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [boardAnchorEl, setBoardAnchorEl] = useState<null | HTMLElement>(null);
  const isBoardMenuOpen = Boolean(boardAnchorEl);

  const openBoardMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBoardAnchorEl(event.currentTarget);
  };

  const closeBoardMenu = () => {
    setBoardAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  // Dialog Controls
  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleRenameTaskboard = async (newBoardTitle: string) => {
    if (newBoardTitle) {
      const url = `${process.env.REACT_APP_BASE_URL}/taskboards/${activeTaskboardId}`;
      await axios.patch(url, {
        cardTitle: newBoardTitle,
      });
      globalDispatch({
        type: "update taskboard",
        payload: newBoardTitle,
      });
    } else {
      console.log(newBoardTitle);
    }
  };

  const deleteTaskboard = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/taskboards/${activeTaskboardId}`;
    const deleteResponse = await axios.delete(url);
    const deletedTaskboard = deleteResponse.data;
    globalDispatch({
      type: "delete taskboard",
      payload: deletedTaskboard,
    });
    closeBoardMenu();
    console.log(deleteResponse.data);
  };

  return (
    <nav id="main-navbar">
      <Paper square={true} elevation={3}>
        <div id="board-title">
          <h3>{activeTasksboard?.boardTitle}</h3>
          <IconButton aria-label="more board actions" onClick={openBoardMenu}>
            <MoreVert />
          </IconButton>
          <OptionsMenu
            anchorEl={boardAnchorEl}
            open={isBoardMenuOpen}
            component="board"
            closeMenu={closeBoardMenu}
            deleteAction={deleteTaskboard}
            fieldRef={taskboardRef}
            renameAction={() => {
              const newBoardTitle = taskboardRef.current?.value;
              if (newBoardTitle) {
                return handleRenameTaskboard(newBoardTitle);
              }
            }}
          />
        </div>
        <div id="nav-button-group">
          <Button variant="contained" onClick={handleClickOpen}>
            clear current
          </Button>
          <AlertDialog
            dialogTitle="Are you sure?"
            handleClose={handleClose}
            open={isDialogOpen}
            handleAlert={handleClearAll}
          />
          <Button variant="contained">export</Button>
          <IconButton aria-label="more actions" onClick={openMenu}>
            <MoreHoriz />
          </IconButton>
          <Menu
            id="more-settings"
            anchorEl={anchorEl}
            open={open}
            onClose={closeMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem>
              <MaterialUISwitch
                sx={{ m: 1 }}
                checked={isChecked}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  changeTheme(event);
                  closeMenu();
                  setIsChecked(!isChecked);
                }}
              />
            </MenuItem>
          </Menu>
        </div>
      </Paper>
    </nav>
  );
};

// Theme switch from MUI Docs
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

export default MainNavbar;
