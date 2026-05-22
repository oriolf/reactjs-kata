import { Add, Upload } from "@mui/icons-material";
import { Button, IconButton, TableCell, TableRow } from "@mui/material";
import { useState } from "react";
import { EditingStatus, IdleEditingStatus, JsonOk } from "../api/types";
import { ApiError, useHttp } from "../hooks/useHttp";
import { sendAlerts } from "../utils";
import RowField from "./RowField";
import { useAlerts } from "../App";
import ImportMembersDialog from "./ImportMembersDialog";

export default function AddMemberRow({ fetchFunc }: { fetchFunc: () => void }) {
  const [status, setStatus] = useState<EditingStatus>(IdleEditingStatus());
  const [values, setValues] = useState({});
  const [importing, setImporting] = useState(false);
  const { post, query } = useHttp();
  const { sendAlert } = useAlerts();
  const translateMsgAdd = "Afegeix";
  const translateMsgImport = "Importa";

  const changeFunc = (newValue: any) => setValues({ ...values, ...newValue });

  const queryValidity = () => {
    query<JsonOk>("api/members", values)
      .then(() => setStatus(status.clearErrors()))
      .catch((err: ApiError) => {
        let errors: { [key: string]: string[] } = {};
        for (var k in err.errors) {
          if (k in values) {
            errors[k] = err.errors[k];
          }
        }
        setStatus(status.setErrors({ errors: errors }));
      });
  };

  const add = (): Promise<void> => {
    setStatus(status.setLoading());
    return post<JsonOk>("api/members", values)
      .then(() => {
        setStatus(IdleEditingStatus());
        fetchFunc();
      })
      .catch((err: ApiError) => {
        setStatus(status.setErrors(err));
        sendAlerts(sendAlert, err);
      });
  };

  if (!status.isEditing()) {
    return (
      <TableRow>
        <TableCell colSpan={4} padding="none">
          <Button
            variant="contained"
            sx={{ ml: 1, mt: 1, mb: 1 }}
            endIcon={<Add />}
            onClick={() => setStatus(status.setEditing(true))}
            data-testid="members-add-open"
          >
            {translateMsgAdd}
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ ml: 1, mt: 1, mb: 1 }}
            endIcon={<Upload />}
            onClick={() => setImporting(true)}
            data-testid="members-import-open"
          >
            {translateMsgImport}
          </Button>
          {importing && (
            <ImportMembersDialog
              open={importing}
              closeFunc={() => {
                setImporting(false);
                fetchFunc();
              }}
            />
          )}
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
          dataTestId="member-name"
        />
      </TableCell>
      <TableCell padding="none" sx={{ px: 1 }}>
        <RowField
          name="nif"
          status={status}
          changeFunc={changeFunc}
          blurFunc={queryValidity}
          dataTestId="member-nif"
        />
      </TableCell>
      <TableCell padding="none" sx={{ px: 1 }}>
        <RowField
          name="joined_on"
          type="date"
          status={status}
          changeFunc={changeFunc}
          blurFunc={queryValidity}
          dataTestId="member-joined"
        />
      </TableCell>
      <TableCell>
        <IconButton
          onClick={add}
          loading={status.isLoading()}
          data-testid="members-add-add"
        >
          <Add />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
