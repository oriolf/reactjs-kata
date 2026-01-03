import { useEffect, useState } from "react";
import { ApiError, useHttp } from "../hooks/useHttp";
import { TableCell, TableRow, Typography } from "@mui/material";
import PaginatedTable from "../components/PaginatedTable";
import Layout from "../Layout";
import { useAlerts } from "../App";

import { ApiCallStatus, LoadingStatus, type ListResponse } from "../api/types";
import type { Member } from "../api/Member";
import TableErrors from "../components/TableErrors";
import TableLoading from "../components/TableLoading";

export const MembersPage = () => {
  const [status, setStatus] = useState<ApiCallStatus<Member[]>>(
    LoadingStatus(true)
  );
  const { get } = useHttp();
  const { sendAlert } = useAlerts();
  useEffect(() => {
    get<ListResponse<Member>>("api/members")
      .then((data) => setStatus(status.setResult(data.items)))
      .catch((err: ApiError) => setStatus(status.setErrors(err, sendAlert)));
  }, []);
  const translateMsgTitle = "Membres";
  const translateMsgHeaders = ["Nom", "NIF", "Soci/a des de"];
  return (
    <Layout title={translateMsgTitle}>
      <PaginatedTable headers={translateMsgHeaders}>
        {status.isLoading() ? <TableLoading /> : null}
        {status.isErrors() ? (
          <TableErrors errors={status.errors} columnCount={3} />
        ) : null}
        {status.isResult()
          ? status.result.map((member: any) => (
              <TableRow key={member.id}>
                <TableCell component="th" scope="row">
                  {member.name}
                </TableCell>
                <TableCell>{member.nif}</TableCell>
                <TableCell>{member.joined_on}</TableCell>
              </TableRow>
            ))
          : null}
      </PaginatedTable>
    </Layout>
  );
};
