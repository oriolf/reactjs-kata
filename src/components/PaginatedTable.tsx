import {
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import type { TableHeader } from "../api/types";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "../utils";

export default function PaginatedTable({
  title,
  headers,
  children,
  total,
  fetchFunc,
  paginate = true,
  showFilter = true,
}: {
  title?: string;
  headers: TableHeader[];
  children: any;
  total?: number;
  fetchFunc: (page: number, itemsPerPage: number, filter: string) => void;
  paginate?: boolean;
  showFilter?: boolean;
}) {
  const defaultPerPage = 10;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);
  const [filter, setFilter] = useState("");
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };
  useEffect(() => {
    fetchFunc(page, rowsPerPage, filter);
  }, [page, rowsPerPage, filter]);
  return (
    <Paper>
      {title && (
        <Toolbar sx={{ pl: { sm: 2 } }}>
          <Typography sx={{ flex: "1 1 100%" }} variant="h6">
            {title}
          </Typography>
          {showFilter && (
            <TextField
              margin="dense"
              size="small"
              onInput={debounce(handleFilter, 250)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
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
          {paginate && (
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
          )}
        </Table>
      </TableContainer>
    </Paper>
  );
}
