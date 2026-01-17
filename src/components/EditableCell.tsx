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
  fieldName,
  component,
  scope,
  width,
  currentValue,
  updateFunc,
}: {
  fieldName: string;
  component?: any;
  scope?: any;
  width: any;
  currentValue: any;
  updateFunc: (x: string) => Promise<void>;
}) {
  const [status, setStatus] = useState<EditingStatus>(IdleEditingStatus());
  const [name, setName] = useState("");
  const [over, setOver] = useState(false);
  const handleClick = () => {
    if (!status.isActive()) setStatus(status.setEditing(true));
  };
  const handleSubmit = () => {
    setStatus(status.setLoading());
    return updateFunc(name).catch((err) => setStatus(status.setErrors(err)));
  };
  const handleKeyUp = (event: any) => {
    if (event.key === "Enter") handleSubmit();
    if (event.key === "Escape") setStatus(IdleEditingStatus());
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const input = (
    <TextField
      name={fieldName}
      margin="dense"
      size="small"
      fullWidth={true}
      defaultValue={currentValue}
      onBlur={handleSubmit}
      onKeyUp={handleKeyUp}
      onChange={handleChange}
      autoFocus={true}
      error={status.hasError(fieldName)}
      helperText={status.errorText(fieldName)}
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
