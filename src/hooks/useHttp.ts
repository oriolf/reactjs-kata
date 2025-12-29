import { useAuth } from "./useAuth";

const BASE_URL = "http://localhost:8080/";

export const useHttp = () => {
  const { logout } = useAuth();

  async function result<T>(res: Response): Promise<T | null> {
    if (res.status === 401) {
      const translateMsg = "La sessió ha caducat";
      logout(translateMsg);
    }
    if (res.status !== 200) {
      return null;
    }

    return await res.json();
  }

  async function post<T>(url: string, body: any): Promise<T | null> {
    const res = await fetch(BASE_URL + url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(body),
    });

    return await result(res);
  }

  async function get<T>(url: string): Promise<T | null> {
    const res = await fetch(BASE_URL + url, {
      credentials: "include",
    });

    return await result(res);
  }

  return { get, post };
};
