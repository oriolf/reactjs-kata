import { TableCell, TableRow } from "@mui/material";
import { JsonError } from "../api/types";

export default function TableErrors({ errors }: { errors: JsonError }) {
  const errs = errors.errors["__form__"];
  return (
    <>
      {errs.map((err) => (
        <TableRow key={err}>
          <TableCell component="th" scope="row">
            {err}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
