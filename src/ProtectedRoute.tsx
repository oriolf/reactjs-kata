import { useAuth } from "./hooks/useAuth";
import { useAlerts, NewAlertMessage } from "./App";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProtectedRoute: any = ({ children }: { children: any }) => {
  const { user } = useAuth();
  const { sendAlert } = useAlerts();
  const navigate = useNavigate();
  useEffect(() => {
    const loginUrl = "/login";
    if (!user && !window.location.pathname.startsWith(loginUrl)) {
      const translateMsg = "Pàgina protegida, per favor, inicia sessió primer";
      sendAlert(NewAlertMessage(translateMsg, "warning", "logout"));
      navigate(loginUrl);
    }
  });

  return user ? children : <></>;
};
