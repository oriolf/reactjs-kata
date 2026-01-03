import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";

export default function PaginatedTable({
  title,
  headers,
  children,
}: {
  title?: string;
  headers: string[];
  children: any;
}) {
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
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody style={{ position: "relative" }}>{children}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
