import {
  CircularProgress,
  InputAdornment,
  TableCell,
  TextField,
} from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { EditingStatus, IdleEditingStatus } from "../api/types";

export default function EditableCell({
  name,
  component,
  scope,
  width,
  currentValue,
  updateFunc,
  dataTestId,
}: {
  name: string;
  component?: any;
  scope?: any;
  width: any;
  currentValue: any;
  updateFunc: (x: string) => Promise<void>;
  dataTestId?: string;
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
    if (event.key === "Escape") {
      setStatus(IdleEditingStatus());
      setValue(currentValue);
    }
  };
  const handleChange = (event: any) => {
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
        htmlInput: { "data-testid": dataTestId },
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
    <span data-testid={dataTestId}>
      {currentValue}
      {over && <EditIcon fontSize="inherit" color="action" sx={{ ml: 1 }} />}
    </span>
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
