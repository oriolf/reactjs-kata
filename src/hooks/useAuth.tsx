import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { NewAlertMessage, useAlerts } from "../App";

import type { User } from "../api/User";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: any }): any => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  const { sendAlert } = useAlerts();

  const login = async (data: User) => {
    setUser(data);
    navigate("/");
  };

  const logout = (msg?: string) => {
    if (msg) {
      sendAlert(NewAlertMessage(msg, "warning", "logout"));
    }
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): any => {
  return useContext<{}>(AuthContext);
};
