import { createContext, useContext, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useLocalStorage } from "./useLocalStorage"
const AuthContext = createContext({})

export const AuthProvider = ({ children }: {children: any}): any => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate()

  const login = async (data: any) => {
    setUser(data)
    navigate("/")
  }

  const logout = (msg: string|undefined) => {
    setUser(null)
    let url = "/";
    if (msg) {
      url += "?alert=" + msg;
    }
    navigate(url, { replace: true })
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): any => {
  return useContext<{}>(AuthContext)
}

