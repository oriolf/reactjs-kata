import { useState } from "react";
import { ApiError, useHttp } from "../hooks/useHttp";
import { TableCell, TableRow } from "@mui/material";
import PaginatedTable from "../components/PaginatedTable";
import Layout from "../Layout";
import { useAlerts } from "../App";

import {
  ApiCallStatus,
  JsonOk,
  LoadingStatus,
  type ListResponse,
} from "../api/types";
import type { Member } from "../api/Member";
import TableErrors from "../components/TableErrors";
import TableLoading from "../components/TableLoading";
import EditableCell from "../components/EditableCell";
import DeleteButton from "../components/DeleteButton";

export const MembersPage = () => {
  const [fetchParams, setFetchParams] = useState<[number, number, string]>([
    0,
    10,
    "",
  ]);
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
  const { get, patch, doDelete } = useHttp();
  const { sendAlert } = useAlerts();
  const fetchFunc = (page: number, itemsPerPage: number, filter: string) => {
    setFetchParams([page, itemsPerPage, filter]);
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
  const patchMember = (
    id: number,
    field: string
  ): ((x: string) => Promise<void>) => {
    return (value: string): Promise<void> => {
      return patch<JsonOk>("api/members/" + id, { [field]: value }).then(() => {
        const [page, itemsPerPage, filter] = fetchParams;
        return fetchFunc(page, itemsPerPage, filter);
      });
    };
  };
  const deleteMember = (id: number): Promise<void> => {
    console.log("Deleting member", id);
    return doDelete("api/members/" + id).then(() => {
      const [page, itemsPerPage, filter] = fetchParams;
      return fetchFunc(page, itemsPerPage, filter);
    });
  };
  const translateMsgTitle = "Membres";
  const translateMsgHeaders = [
    { key: 1, label: "Nom", width: 45 },
    { key: 2, label: "NIF", width: 25 },
    { key: 3, label: "Soci/a des de", width: 25 },
    { key: 4, label: "Acció", width: 5 },
  ];
  const rows = status.result?.items.map((member: Member) => (
    <TableRow key={member.id}>
      <EditableCell
        component="th"
        scope="row"
        width="45%"
        name="name"
        currentValue={member.name}
        updateFunc={patchMember(member.id, "name")}
      />
      <EditableCell
        width="25%"
        name="nif"
        currentValue={member.nif}
        updateFunc={patchMember(member.id, "nif")}
      />
      <TableCell width="25%">{member.joined_on}</TableCell>
      <TableCell width="5%">
        <DeleteButton deleteFunc={() => deleteMember(member.id)} />
      </TableCell>
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
