import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

export const ProtectedRoute: any = ({ children }: { children: any }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login?alert=Pàgina protegida, per favor, inicia sessió primer" />;
  }

  return children;
};
