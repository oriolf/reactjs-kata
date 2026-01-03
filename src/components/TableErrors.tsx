import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { JsonError } from "../api/types";
import ErrorIcon from "@mui/icons-material/WarningRounded";

export default function TableErrors({
  errors,
  columnCount,
}: {
  errors: JsonError;
  columnCount: number;
}) {
  const errs = errors.errors["__form__"];
  return (
    <>
      {errs.map((err) => (
        <TableRow key={err}>
          <TableCell
            component="th"
            scope="row"
            colSpan={columnCount}
            sx={{ py: 2 }}
          >
            <Typography color="error">
              <Box display="flex" alignItems="center" justifyContent="center">
                <ErrorIcon sx={{ mr: 1 }} />
                {err}
              </Box>
            </Typography>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
