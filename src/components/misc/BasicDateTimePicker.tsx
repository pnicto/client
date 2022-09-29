import { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";

type Props = {
  date: Dayjs | null;
  handleDateChange: (newDate: Dayjs | null) => void;
  label: string;
};

// Everything from MUI docs
const BasicDateTimePicker = ({ date, handleDateChange, label }: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        disablePast
        value={date}
        onChange={handleDateChange}
        renderInput={(params: any) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default BasicDateTimePicker;
