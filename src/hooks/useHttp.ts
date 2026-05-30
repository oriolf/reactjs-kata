import { useAuth } from "./useAuth";
import type { JsonApiError, JsonError } from "../api/types";

const BASE_URL = "http://localhost:8080/";

export class ApiError extends Error {
  errors: JsonApiError;

  constructor(json: JsonError) {
    super("ApiError");
    this.name = "ApiError";
    this.errors = json.errors;
  }
}

function jsonHeaders() {
  return { "Content-Type": "application/json" };
}

export const useHttp = () => {
  const { logout } = useAuth();

  async function result<T>(res: Response): Promise<T> {
    let json = await res.json();
    if (res.status === 401) {
      const translateMsg = "La sessió ha caducat";
      logout(translateMsg);
    }

    if (res.status !== 200) {
      throw new ApiError(json);
    }

    return json;
  }

  async function post<T>(url: string, body: any): Promise<T> {
    const res = await fetch(BASE_URL + url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(body),
      headers: jsonHeaders(),
    });

    return await result(res);
  }

  async function patch<T>(url: string, body: any): Promise<T> {
    const res = await fetch(BASE_URL + url, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(body),
      headers: jsonHeaders(),
    });

    return await result(res);
  }

  async function query<T>(url: string, body: any): Promise<T> {
    const res = await fetch(BASE_URL + url, {
      method: "QUERY",
      credentials: "include",
      body: JSON.stringify(body),
      headers: jsonHeaders(),
    });

    return await result(res);
  }

  async function doDelete<T>(url: string): Promise<T> {
    const res = await fetch(BASE_URL + url, {
      method: "DELETE",
      credentials: "include",
    });

    return await result(res);
  }

  async function get<T>(url: string): Promise<T> {
    const res = await fetch(BASE_URL + url, {
      credentials: "include",
    });

    return await result(res);
  }

  return { get, post, patch, query, doDelete };
};
