import { Edit } from "@mui/icons-material";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { TaskitemInterface } from "../interfaces/interfaces";

const Taskitem = ({ id, completed, description, title }: TaskitemInterface) => {
  return (
    <ListItem disablePadding={true}>
      <ListItemButton disableRipple={true} disableGutters={true}>
        <Checkbox onClick={() => console.log("CLicked checkbox")} />
        <ListItemText>{title}</ListItemText>
        <ListItemSecondaryAction>
          <IconButton onClick={() => console.log("Pressed edit")}>
            <Edit />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItemButton>
    </ListItem>
  );
};

export default Taskitem;
