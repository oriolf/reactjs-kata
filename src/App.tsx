import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { MembersPage } from "./pages/MembersPage";
import { ProtectedRoute } from "./ProtectedRoute";
import "./App.css";
import { AlertMessage } from "./api/types";

const AlertsContext = createContext({
  sendAlert: (msg: AlertMessage): void => {},
});

export function NewAlertMessage(
  msg: string,
  level: "info" | "warning" | "error" = "warning",
  cause?: string
): AlertMessage {
  return {
    msg: msg,
    key: new Date().getTime(),
    level: level,
    cause: cause,
  };
}

export function App() {
  const [snackPack, setSnackpack] = useState<AlertMessage[]>([]);
  const [messageInfo, setMessageinfo] = useState<AlertMessage | undefined>(
    undefined
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const sendAlert = (alert: AlertMessage): void => {
    setSnackpack((prev) => {
      let newAlerts = [...prev];
      let a = !alert.cause && !newAlerts.some((x) => x.msg === alert.msg);
      let b = alert.cause && !newAlerts.some((x) => x.cause === alert.cause);
      if (a || b) {
        newAlerts.push(alert);
      }

      return newAlerts;
    });
  };

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageinfo({ ...snackPack[0] });
      setSnackpack((prev) => prev.slice(1));
      setOpenSnackbar(true);
    }
  }, [snackPack, messageInfo, openSnackbar]);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason !== "clickaway") {
      setOpenSnackbar(false);
    }
  };

  const handleExited = () => {
    setMessageinfo(undefined);
  };

  const alertsValue = useMemo(() => ({ sendAlert }), []);
  return (
    <AlertsContext.Provider value={alertsValue}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <MembersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        slotProps={{ transition: { onExited: handleExited } }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={messageInfo ? messageInfo.level : "warning"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {messageInfo ? messageInfo.msg : undefined}
        </Alert>
      </Snackbar>
    </AlertsContext.Provider>
  );
}

export const useAlerts = (): { sendAlert: (msg: AlertMessage) => void } => {
  return useContext(AlertsContext);
};
