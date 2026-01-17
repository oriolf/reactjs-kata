import {
  CircularProgress,
  InputAdornment,
  TableCell,
  TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { EditingStatus, IdleEditingStatus } from "../api/types";

export default function EditableCell({
  name,
  component,
  scope,
  width,
  currentValue,
  updateFunc,
}: {
  name: string;
  component?: any;
  scope?: any;
  width: any;
  currentValue: any;
  updateFunc: (x: string) => Promise<void>;
}) {
  const [status, setStatus] = useState<EditingStatus>(IdleEditingStatus());
  const [value, setValue] = useState(currentValue);
  const [over, setOver] = useState(false);
  const handleClick = () => {
    if (!status.isActive()) setStatus(status.setEditing(true));
  };
  const handleSubmit = () => {
    setStatus(status.setLoading());
    return updateFunc(value).catch((err) => setStatus(status.setErrors(err)));
  };
  const handleKeyUp = (event: any) => {
    if (event.key === "Enter") handleSubmit();
    if (event.key === "Escape") setStatus(IdleEditingStatus());
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const input = (
    <TextField
      name={name}
      margin="dense"
      size="small"
      fullWidth={true}
      defaultValue={currentValue}
      onBlur={handleSubmit}
      onKeyUp={handleKeyUp}
      onChange={handleChange}
      autoFocus={true}
      error={status.hasError(name)}
      helperText={status.errorText(name)}
      slotProps={{
        input: {
          endAdornment: status.isLoading() && (
            <InputAdornment position="end">
              <CircularProgress size="20px" />,
            </InputAdornment>
          ),
        },
      }}
    />
  );
  const current = (
    <>
      {currentValue}
      {over && <EditIcon fontSize="inherit" color="action" sx={{ ml: 1 }} />}
    </>
  );
  return (
    <TableCell
      component={component}
      scope={scope}
      width={width}
      onMouseOver={() => setOver(true)}
      onMouseOut={() => setOver(false)}
      onClick={handleClick}
      padding={status.isActive() ? "none" : "normal"}
      style={{ cursor: "pointer" }}
      sx={{ px: status.isActive() ? 1 : undefined }}
    >
      {status.isActive() ? input : current}
    </TableCell>
  );
}
