import { Backdrop, CircularProgress, TableCell, TableRow } from "@mui/material";

export default function TableLoading({ children }: { children: any }) {
  return (
    <>
      {children}
      <TableRow style={{ height: "0px" }}>
        <TableCell style={{ padding: 0, border: 0 }}>
          <Backdrop
            open={true}
            style={{ position: "absolute" }}
            sx={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          >
            <CircularProgress />
          </Backdrop>
        </TableCell>
      </TableRow>
    </>
  );
}
