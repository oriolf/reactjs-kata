import { useState } from "react";
import { ApiError, useHttp } from "../hooks/useHttp";
import { TableCell, TableRow } from "@mui/material";
import PaginatedTable from "../components/PaginatedTable";
import Layout from "../Layout";
import { useAlerts } from "../App";

import { ApiCallStatus, LoadingStatus, type ListResponse } from "../api/types";
import type { Member } from "../api/Member";
import TableErrors from "../components/TableErrors";
import TableLoading from "../components/TableLoading";

export const MembersPage = () => {
  const [status, setStatus] = useState<ApiCallStatus<ListResponse<Member>>>(
    LoadingStatus(true, {
      total: 0,
      items: [
        {
          id: 0,
          name: "-",
          nif: "-",
          joined_on: "-",
          left_on: null,
          iban: null,
        },
      ],
    })
  );
  const { get } = useHttp();
  const { sendAlert } = useAlerts();
  const fetchFunc = (page: number, itemsPerPage: number, filter: string) => {
    const params = new URLSearchParams({
      page: page + "",
      itemsPerPage: itemsPerPage + "",
      search: filter,
    });
    setStatus(status.setLoading(true));
    get<ListResponse<Member>>("api/members?" + params.toString())
      .then((data) => setStatus(status.setResult(data)))
      .catch((err: ApiError) => setStatus(status.setErrors(err, sendAlert)));
  };
  const translateMsgTitle = "Membres";
  const translateMsgHeaders = [
    { key: 1, label: "Nom", width: 50 },
    { key: 2, label: "NIF", width: 25 },
    { key: 3, label: "Soci/a des de", width: 25 },
  ];
  const rows = status.result?.items.map((member: Member) => (
    <TableRow key={member.id}>
      <TableCell component="th" scope="row" width="50%">
        {member.name}
      </TableCell>
      <TableCell width="25%">{member.nif}</TableCell>
      <TableCell width="25%">{member.joined_on}</TableCell>
    </TableRow>
  ));
  return (
    <Layout title={translateMsgTitle}>
      <PaginatedTable
        title={translateMsgTitle}
        headers={translateMsgHeaders}
        total={status.result?.total}
        fetchFunc={fetchFunc}
      >
        {status.isLoading() && <TableLoading>{rows}</TableLoading>}
        {status.isErrors() && (
          <TableErrors errors={status.errors} columnCount={3} />
        )}
        {status.isResult() && rows}
      </PaginatedTable>
    </Layout>
  );
};
