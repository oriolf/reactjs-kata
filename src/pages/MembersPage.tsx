import { useEffect, useState } from "react";
import { useHttp } from "../hooks/useHttp";
import { TableCell, TableRow, Typography } from "@mui/material";
import PaginatedTable from "../components/PaginatedTable";
import Layout from "../Layout";

export const MembersPage = () => {
  const [members, setMembers] = useState<any>(null);
  const { get } = useHttp();
  useEffect(() => {
    get<any>("api/members").then((data) => setMembers(data.items));
  }, []);
  const translateMsgTitle = "Membres";
  const translateMsgHeaders = ["Nom", "NIF", "Soci/a des de"];
  return (
    <Layout title={translateMsgTitle}>
      <Typography component="h1" variant="h5">
        {translateMsgTitle}
      </Typography>
      {members && (
        <PaginatedTable headers={translateMsgHeaders}>
          {members.map((member: any) => (
            <TableRow key={member.id}>
              <TableCell component="th" scope="row">
                {member.name}
              </TableCell>
              <TableCell>{member.nif}</TableCell>
              <TableCell>{member.joined_on}</TableCell>
            </TableRow>
          ))}
        </PaginatedTable>
      )}
    </Layout>
  );
};
