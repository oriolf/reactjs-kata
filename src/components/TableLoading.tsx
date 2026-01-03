import { Backdrop, CircularProgress, TableCell, TableRow } from "@mui/material";

export default function TableLoading() {
  return (
    <TableRow style={{ height: "200px" }}>
      <TableCell>
        <Backdrop
          open={true}
          style={{ position: "absolute" }}
          sx={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          <CircularProgress />
        </Backdrop>
      </TableCell>
    </TableRow>
  );
}
