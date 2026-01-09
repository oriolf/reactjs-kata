import { useState } from "react";
import { ApiError, useHttp } from "../hooks/useHttp";
import { IconButton, TableCell, TableRow } from "@mui/material";
import PaginatedTable from "../components/PaginatedTable";
import Layout from "../Layout";
import { useAlerts } from "../App";

import { ApiCallStatus, JsonOk, LoadingStatus } from "../api/types";
import type { User } from "../api/User";
import type { Session } from "../api/Session";
import TableErrors from "../components/TableErrors";
import TableLoading from "../components/TableLoading";
import { formatDatetime } from "../utils";
import DeleteIcon from "@mui/icons-material/Delete";

export const ProfilePage = () => {
  const [status, setStatus] = useState<ApiCallStatus<User>>(
    LoadingStatus(true, {
      id: 0,
      email: "-",
      roles: [],
      sessions: [
        {
          id: "",
          ip: "-",
          agent: "-",
          time: "-",
          expires: "-",
        },
      ],
    })
  );
  const { get, doDelete } = useHttp();
  const { sendAlert } = useAlerts();
  const deleteSession = (id: string) => {
    doDelete<JsonOk>("api/sessions/" + id).then(() => fetchFunc(0, 0, ""));
  };
  const fetchFunc = (page: number, itemsPerPage: number, filter: string) => {
    setStatus(status.setLoading(true));
    get<User>("api/me")
      .then((data) => setStatus(status.setResult(data)))
      .catch((err: ApiError) => setStatus(status.setErrors(err, sendAlert)));
  };
  const translateMsgTitle = "Perfil";
  const translateMsgTableTitle = "Sessions obertes";
  const translateMsgHeaders = [
    { key: 1, label: "IP", width: 10 },
    { key: 2, label: "Agent", width: 50 },
    { key: 3, label: "Iniciada", width: 15 },
    { key: 4, label: "Caduca", width: 15 },
    { key: 5, label: "Esborra", width: 10 },
  ];
  const rows = status.result?.sessions.map((session: Session) => (
    <TableRow key={session.id}>
      <TableCell component="th" scope="row" width="10%">
        {session.ip}
      </TableCell>
      <TableCell width="60%">{session.agent}</TableCell>
      <TableCell width="15%">{formatDatetime(session.time)}</TableCell>
      <TableCell width="15%">{formatDatetime(session.expires)}</TableCell>
      <TableCell width="10%">
        <IconButton onClick={() => deleteSession(session.id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ));
  return (
    <Layout title={translateMsgTitle}>
      <PaginatedTable
        title={translateMsgTableTitle}
        headers={translateMsgHeaders}
        total={status.result?.sessions.length}
        fetchFunc={fetchFunc}
        paginate={false}
        showFilter={false}
      >
        {status.isLoading() && <TableLoading>{rows}</TableLoading>}
        {status.isErrors() && (
          <TableErrors errors={status.errors} columnCount={5} />
        )}
        {status.isResult() && rows}
      </PaginatedTable>
    </Layout>
  );
};
