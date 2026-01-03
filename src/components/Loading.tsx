import { Backdrop, CircularProgress, TableCell, TableRow } from "@mui/material";

export default function Loading() {
  return (
    <TableRow style={{ height: "200px" }}>
      <TableCell>
        <Backdrop open={true} style={{ position: "absolute" }}>
          <CircularProgress />
        </Backdrop>
      </TableCell>
    </TableRow>
  );
}
