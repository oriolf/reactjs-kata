import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { EditingStatus, IdleEditingStatus } from "../api/types";
import { sendAlerts } from "../utils";
import { useAlerts } from "../App";

export default function AddButton({
  addFunc,
}: {
  addFunc: () => Promise<void>;
}) {
  const { sendAlert } = useAlerts();
  const [status, setStatus] = useState<EditingStatus>(IdleEditingStatus());
  const handleAdd = () => {
    setStatus(status.setLoading());
    return addFunc().catch((errors) => {
      setStatus(IdleEditingStatus());
      sendAlerts(sendAlert, errors);
    });
  };
  return (
    <IconButton onClick={handleAdd} loading={status.isLoading()}>
      <Add />
    </IconButton>
  );
}
