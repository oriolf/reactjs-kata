import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import type { TableHeader } from "../api/types";

export default function PaginatedTable({
  title,
  headers,
  children,
  total,
  fetchFunc,
}: {
  title?: string;
  headers: TableHeader[];
  children: any;
  total?: number;
  fetchFunc: (page: number, itemsPerPage: number) => void;
}) {
  const defaultPerPage = 2;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  useEffect(() => {
    fetchFunc(page, rowsPerPage);
  }, [page, rowsPerPage]);
  return (
    <Paper>
      {title && (
        <Toolbar sx={{ pl: { sm: 2 } }}>
          <Typography sx={{ flex: "1 1 100%" }} variant="h6">
            {title}
          </Typography>
        </Toolbar>
      )}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="a dense table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header.key} width={header.width + "%"}>
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody style={{ position: "relative" }}>{children}</TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[defaultPerPage, 25, 100]}
                count={total || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}
