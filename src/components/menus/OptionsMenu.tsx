import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import AlertDialog from "../dialogs/AlertDialog";

type Props = {
  anchorEl: HTMLElement | null;
  component: "list" | "board";
  open: boolean;
  closeMenu: () => void;
  deleteAction: () => Promise<void>;
};

const OptionsMenu = ({
  anchorEl,
  component,
  open,
  closeMenu,
  deleteAction,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Dialog Controls
  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Menu
      id="more-settings"
      anchorEl={anchorEl}
      open={open}
      onClose={closeMenu}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <MenuItem onClick={closeMenu}>Rename {component}</MenuItem>
      <MenuItem
        onClick={() => {
          handleClickOpen();
        }}
      >
        Delete {component}
      </MenuItem>
      <AlertDialog
        dialogTitle="Are you sure?"
        open={isDialogOpen}
        handleClose={handleClose}
        handleAlert={deleteAction}
      />
    </Menu>
  );
};

export default OptionsMenu;
