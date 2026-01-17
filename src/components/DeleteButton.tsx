import { Delete } from "@mui/icons-material";
import { CircularProgress, IconButton } from "@mui/material";
import { useState } from "react";
import { EditingStatus, IdleEditingStatus } from "../api/types";
import { sendAlerts } from "../utils";
import { useAlerts } from "../App";

export default function DeleteButton({
  deleteFunc,
}: {
  deleteFunc: () => Promise<void>;
}) {
  const { sendAlert } = useAlerts();
  const [status, setStatus] = useState<EditingStatus>(IdleEditingStatus());
  const handleDelete = () => {
    const translateMsg = "Segur que vols esborrar-ho?";
    const confirmed = confirm(translateMsg);
    if (confirmed) {
      setStatus(status.setLoading());
      return deleteFunc().catch((errors) => {
        setStatus(IdleEditingStatus());
        sendAlerts(sendAlert, errors);
      });
    }
  };
  return (
    <IconButton onClick={handleDelete}>
      {status.isLoading() ? <CircularProgress size="24px" /> : <Delete />}
    </IconButton>
  );
}
