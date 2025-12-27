import { useEffect, useState } from "react";
import Layout from "../Layout";
import { useHttp } from "../hooks/useHttp";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

export const MembersPage = () => {
  const [members, setMembers] = useState<any>(null);
  const { get } = useHttp();
  useEffect(() => {
    const fetchData = async () => {
      const data = await get<any>("api/members");
      setMembers(data.items);
      console.log("MEMBERS:", data);
    };
    fetchData();
  }, []);
  return (
    <Layout title="Membres">
      <Typography component="h1" variant="h5">
        Membres
      </Typography>
      {members && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>NIF</TableCell>
                <TableCell>Soci/a des de</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member: any) => (
                <TableRow
                  key={member.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {member.name}
                  </TableCell>
                  <TableCell>{member.nif}</TableCell>
                  <TableCell>{member.joined_on}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Layout>
  );
};
