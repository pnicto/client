import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import AlertDialog from "../dialogs/AlertDialog";
import AddDialog from "../dialogs/AddDialog";
import ShareDialog from "../dialogs/ShareDialog";

type Props = {
  anchorEl: HTMLElement | null;
  component: "list" | "board";
  open: boolean;
  closeMenu: () => void;
  deleteAction: () => Promise<void>;
  renameAction: () => Promise<void> | undefined;
  fieldRef: React.MutableRefObject<HTMLInputElement | undefined>;
  shareAction?: (emails: string[]) => Promise<void>;
  sharedUsers?: number[];
};

const OptionsMenu = ({
  anchorEl,
  component,
  open,
  closeMenu,
  deleteAction,
  renameAction,
  shareAction,
  fieldRef,
  sharedUsers,
}: Props) => {
  // Dialog actions
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleRenameDialogOpen = () => {
    setIsRenameDialogOpen(true);
  };

  const handleRenameDialogClose = () => {
    setIsRenameDialogOpen(false);
  };

  const handleShareDialogOpen = () => {
    setIsShareDialogOpen(true);
  };

  const handleShareDialogClose = () => {
    setIsShareDialogOpen(false);
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
      <MenuItem onClick={handleRenameDialogOpen}>Rename {component}</MenuItem>
      <AddDialog
        dialogTitle={`Rename ${component}`}
        handleClose={() => {
          handleRenameDialogClose();
        }}
        dialogLabel={`${component} name`}
        open={isRenameDialogOpen}
        fieldRef={fieldRef}
        handleSubmit={() => {
          setIsRenameDialogOpen(false);
          renameAction();
        }}
      />
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
      {component === "board" && [
        <MenuItem
          key={1}
          onClick={() => {
            handleShareDialogOpen();
          }}
        >
          Share {component}
        </MenuItem>,
        <ShareDialog
          key={2}
          open={isShareDialogOpen}
          handleClose={handleShareDialogClose}
          handleShare={shareAction}
          sharedUsers={sharedUsers}
        />,
      ]}
    </Menu>
  );
};

export default OptionsMenu;
