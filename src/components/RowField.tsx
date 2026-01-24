import { TextField } from "@mui/material";
import { EditingStatus } from "../api/types";
import { useState } from "react";

export default function RowField({
  name,
  type,
  status,
  autofocus,
  changeFunc,
  blurFunc,
}: {
  name: string;
  type?: "text" | "date";
  status: EditingStatus;
  autofocus?: boolean;
  changeFunc: (value: { [name]: string }) => void;
  blurFunc: () => void;
}) {
  const [pristine, setPristine] = useState(true);
  const onBlur = () => {
    setPristine(false);
    blurFunc();
  };
  return (
    <TextField
      name={name}
      type={type || "text"}
      margin="dense"
      size="small"
      fullWidth={true}
      onChange={(e) => changeFunc({ [name]: e.target.value })}
      onBlur={onBlur}
      autoFocus={autofocus}
      error={!pristine && status.hasError(name)}
      helperText={!pristine && status.errorText(name)}
    />
  );
}
