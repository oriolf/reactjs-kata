import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { EditingStatus, IdleEditingStatus } from "../api/types";
import { sendAlerts } from "../utils";
import { useAlerts } from "../App";

export default function DeleteButton({
  deleteFunc,
  dataTestId,
}: {
  deleteFunc: () => Promise<void>;
  dataTestId?: string;
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
    <IconButton
      onClick={handleDelete}
      loading={status.isLoading()}
      data-testid={dataTestId}
    >
      <Delete />
    </IconButton>
  );
}
