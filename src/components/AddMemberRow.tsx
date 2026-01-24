import { Add } from "@mui/icons-material";
import { Button, TableCell, TableRow } from "@mui/material";
import { useState } from "react";
import { EditingStatus, IdleEditingStatus, JsonOk } from "../api/types";
import { ApiError, useHttp } from "../hooks/useHttp";
import RowField from "./RowField";
import AddButton from "./AddButton";

export default function AddMemberRow({ fetchFunc }: { fetchFunc: () => void }) {
  const [status, setStatus] = useState<EditingStatus>(IdleEditingStatus());
  const [values, setValues] = useState({ name: "", nif: "", joined_on: "" });
  const { post, query } = useHttp();
  const translateMsgAdd = "Afegeix";

  const changeFunc = (newValue: any) => setValues({ ...values, ...newValue });

  const queryValidity = () => {
    query<JsonOk>("api/members", values)
      .then(() => setStatus(status.clearErrors()))
      .catch((err: ApiError) => setStatus(status.setErrors(err)));
  };

  const add = (): Promise<void> => {
    return post<JsonOk>("api/members", values)
      .then(() => fetchFunc())
      .catch((err: ApiError) => setStatus(status.setErrors(err)));
  };

  if (!status.isEditing()) {
    return (
      <TableRow>
        <TableCell colSpan={4} padding="none">
          <Button
            type="submit"
            variant="contained"
            sx={{ ml: 1, mt: 1, mb: 1 }}
            endIcon={<Add />}
            onClick={() => setStatus(status.setEditing(true))}
          >
            {translateMsgAdd}
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell padding="none" sx={{ px: 1 }}>
        <RowField
          name="name"
          status={status}
          changeFunc={changeFunc}
          blurFunc={queryValidity}
          autofocus={true}
        />
      </TableCell>
      <TableCell padding="none" sx={{ px: 1 }}>
        <RowField
          name="nif"
          status={status}
          changeFunc={changeFunc}
          blurFunc={queryValidity}
        />
      </TableCell>
      <TableCell padding="none" sx={{ px: 1 }}>
        <RowField
          name="joined_on"
          type="date"
          status={status}
          changeFunc={changeFunc}
          blurFunc={queryValidity}
        />
      </TableCell>
      <TableCell>
        <AddButton addFunc={add} />
      </TableCell>
    </TableRow>
  );
}
