import { Upload, Redo } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  useTheme,
} from "@mui/material";
import VisuallyHiddenInput from "./VisuallyHiddenInput";
import { ChangeEvent, useState } from "react";
import { parseCsv } from "../utils/csv-utils";
import { ApiCallStatus, LoadingStatus } from "../api/types";
import { ApiError, useHttp } from "../hooks/useHttp";

type ImportResult =
  | {
      errors: string[];
    }
  | { id: number };

type ImportResponse = {
  results: ImportResult[];
};

function isResultOk(r: ImportResult): r is { id: number } {
  return "id" in r;
}

export default function ImportMembersDialog({
  open,
  closeFunc,
}: {
  open: boolean;
  closeFunc: () => void;
}) {
  const theme = useTheme();
  const { post } = useHttp();
  const [status, setStatus] = useState<ApiCallStatus<ImportResponse>>(
    LoadingStatus(false)
  );
  const [fileInfo, setFileInfo] = useState("");
  const [fileError, setFileError] = useState(false);
  const [contents, setContents] = useState<string[][] | undefined>();
  const [csv, setCsv] = useState<string | undefined>();
  const [params, setParams] = useState<{
    name_column: number | null;
    nif_column: number | null;
    joined_on_column: number | null;
    skip_first_row: boolean;
  }>({
    name_column: 0,
    nif_column: 1,
    joined_on_column: 2,
    skip_first_row: true,
  });

  const translateMsgTitle = "Importa membres";
  const translateMsgExplanation =
    "Pots seleccionar un arxiu de tipus CSV amb la informació dels membres per crear-los tots alhora.";
  const translateMsgClose = "Tanca";
  const translateMsgAdd = "Afegeix";
  const translateMsgSelect = "Selecciona l'arxiu";
  const translateMsgFileError = "L'arxiu ha de ser un CSV vàlid";
  const translateMsgReset = "Puja un altre arxiu";
  const translateMsgError = "No s'ha pogut importar l'arxiu:";
  const translateMsgResult =
    "S'ha importat l'arxiu, però algunes files poden haver fallat:";
  const translateNameColumn = "Columna del nom";
  const translateNifColumn = "Columna del NIF";
  const translateJoinedOnColumn = "Columna de la data d'alta";
  const translateSkipLabel = "Ignora la primera fila (capçaleres)";
  const translateMsgRowOk = "La fila s'ha importat correctament";
  const translateMsgRowError = "La fila conté errors:";
  const translateFieldNames: { [key: string]: string } = {
    name: "Nom",
    nif: "DNI",
    joined_on: "Data d'alta",
  };

  const badColumns = (row: string[]): boolean => {
    return (
      params.name_column == null ||
      params.nif_column == null ||
      params.joined_on_column == null ||
      params.name_column < 0 ||
      params.nif_column < 0 ||
      params.joined_on_column < 0 ||
      params.name_column >= row.length ||
      params.nif_column >= row.length ||
      params.joined_on_column >= row.length ||
      params.name_column === params.nif_column ||
      params.name_column === params.joined_on_column ||
      params.nif_column === params.joined_on_column
    );
  };

  const addDisabled = (): boolean => {
    return !contents || contents.length === 0 || badColumns(contents[0]);
  };

  const reset = () => {
    setFileInfo("");
    setCsv(undefined);
    setContents(undefined);
    setStatus(LoadingStatus(false));
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    reset();
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      setFileError(true);
      return;
    }
    if (file.type !== "text/csv") {
      setFileError(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || "";
      if (result) {
        setFileError(false);
        const rows = parseCsv(result);
        const translateMsgFileInfo = `L'arxiu té ${rows.length} files i ${rows[0].length} columnes. Per favor, selecciona quina columna correspon a cada camp:`;
        setFileInfo(translateMsgFileInfo);
        setCsv(result);
        setContents(rows);
      }
    };
    reader.onerror = () => {
      setFileError(true);
    };
    reader.readAsText(file);
  };

  const add = () => {
    setStatus(status.setLoading(true));
    post<ImportResponse>("api/members/import", {
      ...params,
      csv,
    })
      .then((res) => setStatus(status.setResult(res)))
      .catch((err: ApiError) => setStatus(status.setErrors(err)));
  };

  const form = status.isPending() && (
    <>
      <DialogContentText>{translateMsgExplanation}</DialogContentText>
      {fileError && (
        <DialogContentText>{translateMsgFileError}</DialogContentText>
      )}
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        endIcon={<Upload />}
        sx={{ mt: 1, mb: 1 }}
        data-testid="members-import-file"
      >
        {translateMsgSelect}
        <VisuallyHiddenInput type="file" onChange={handleFile} />
      </Button>

      {fileInfo && (
        <DialogContentText sx={{ mb: 1 }}>{fileInfo}</DialogContentText>
      )}

      {contents && (
        <>
          <FormControlLabel
            control={
              <Switch
                checked={params.skip_first_row}
                onChange={(e: any) =>
                  setParams({ ...params, skip_first_row: e.target.checked })
                }
              />
            }
            label={translateSkipLabel}
          />
          <FormControl sx={{ mt: 2 }} fullWidth>
            <InputLabel id="name-column">{translateNameColumn}</InputLabel>
            <Select
              labelId="name-column"
              label={translateNameColumn}
              value={params.name_column}
              onChange={(e: any) =>
                setParams({ ...params, name_column: +e.target.value })
              }
            >
              {contents[0].map((col, i) => (
                <MenuItem value={i} key={i}>
                  {col} (columna {i + 1})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ mt: 2 }} fullWidth>
            <InputLabel id="nif-column">{translateNifColumn}</InputLabel>
            <Select
              labelId="nif-column"
              label={translateNifColumn}
              value={params.nif_column}
              onChange={(e: any) =>
                setParams({ ...params, nif_column: +e.target.value })
              }
            >
              {contents[0].map((col, i) => (
                <MenuItem value={i} key={i}>
                  {col} (columna {i + 1})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ mt: 2 }} fullWidth>
            <InputLabel id="joined-on-column">
              {translateJoinedOnColumn}
            </InputLabel>
            <Select
              labelId="joined-on-column"
              label={translateJoinedOnColumn}
              value={params.joined_on_column}
              onChange={(e: any) =>
                setParams({ ...params, joined_on_column: +e.target.value })
              }
            >
              {contents[0].map((col, i) => (
                <MenuItem value={i} key={i}>
                  {col} (columna {i + 1})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </>
  );

  const rowErrors = (errors: string[] | { [key: string]: string[] }) => {
    if (Array.isArray(errors)) {
      return errors.map((e, i) => <li key={i}>{e}</li>);
    }

    return Object.keys(errors).map((k, i) => (
      <li key={i}>
        {translateFieldNames[k]}:{" "}
        <ul>
          {errors[k].map((e, j) => (
            <li key={j}>{e}</li>
          ))}
        </ul>
      </li>
    ));
  };
  const result = status.isResult() && (
    <>
      <DialogContentText>{translateMsgResult}</DialogContentText>
      <DialogContentText component="span">
        <ol>
          {status.result.results.map((r, i) =>
            isResultOk(r) ? (
              <li key={i}>{translateMsgRowOk}</li>
            ) : (
              <li key={i} style={{ color: theme.palette.error.main }}>
                {translateMsgRowError}
                <ul>{rowErrors(r.errors)}</ul>
              </li>
            )
          )}
        </ol>
      </DialogContentText>
      <Button
        onClick={reset}
        endIcon={<Redo />}
        variant="contained"
        color="primary"
      >
        {translateMsgReset}
      </Button>
    </>
  );
  const error = status.isErrors() && (
    <>
      <DialogContentText>{translateMsgError}</DialogContentText>
      <DialogContentText component="span">
        <ul>
          {status.errors.errors.global.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </DialogContentText>
      <Button onClick={reset} endIcon={<Redo />} color="primary">
        {translateMsgReset}
      </Button>
    </>
  );
  const addButton = (status.isPending() || status.isLoading()) && (
    <Button
      disabled={addDisabled()}
      loading={status.isLoading()}
      onClick={add}
      data-testid="members-import-add"
    >
      {translateMsgAdd}
    </Button>
  );
  return (
    <Dialog open={open} onClose={closeFunc} fullWidth={true} maxWidth="lg">
      <DialogTitle>{translateMsgTitle}</DialogTitle>
      <DialogContent>
        {form}
        {status.isLoading() && <CircularProgress />}
        {result}
        {error}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeFunc} data-testid="members-import-close">
          {translateMsgClose}
        </Button>
        {addButton}
      </DialogActions>
    </Dialog>
  );
}
