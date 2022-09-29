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
  deleteAction: () => void;
  renameAction: () => void | undefined;
  fieldRef: React.MutableRefObject<HTMLInputElement | undefined>;
  shareAction?: (emails: string[]) => Promise<void>;
  sharedUsers?: number[];
};

const OptionsMenu = ({
  anchorEl, // used to set the position of the popover refer MUI docs for more info
  component, // Since I am using this options menu for both card and board, for labeling I use this string
  open, // Menu's state
  closeMenu, // Close menu function
  deleteAction, // Delete action  for both card and board
  renameAction, // Rename action for both card and board
  shareAction, // Share action only available for board
  fieldRef, // Ref for input field in rename dialog
  sharedUsers, // Shared users IDs for share dialog
}: Props) => {
  // Dialog actions
  const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // TODO:Convert them into a single function
  const handleClickOpen = () => {
    setIsDeleteAlertDialogOpen(true);
  };
  const handleClose = () => {
    setIsDeleteAlertDialogOpen(false);
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
        open={isDeleteAlertDialogOpen}
        handleClose={handleClose}
        handleAlert={deleteAction}
      />

      {/* Added keys as 1 and 2 because it's not that they are gonna refer anything unlike a populated list */}
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
