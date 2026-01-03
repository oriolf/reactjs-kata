import { sendAlerts } from "../utils";

export type JsonOk = { ok: boolean };

export type JsonError = {
  errors: {
    [key: string]: string[];
  };
};

export type ListResponse<T> = {
  items: T[];
  total: number;
};

export function isOk(res: JsonOk | JsonError): res is JsonOk {
  return (<JsonOk>res).ok === true;
}

export function isError(res: any | JsonError): res is JsonError {
  return (<JsonError>res).errors !== undefined;
}

export type AlertMessage = {
  msg: string;
  key: number;
  level: "info" | "warning" | "error";
  cause?: string;
};

export class ApiCallStatus<T> {
  result?: T;
  errors?: JsonError;

  constructor(result?: T, errors?: JsonError) {
    this.result = result;
    this.errors = errors;
  }

  isLoading(): this is ApiCallLoadingStatus {
    return this.result === undefined && this.errors === undefined;
  }

  isResult(): this is ApiCallResultStatus<T> {
    return this.result !== undefined;
  }

  isErrors(): this is ApiCallErrorsStatus<T> {
    return this.errors !== undefined;
  }

  setResult(result: T): ApiCallStatus<T> {
    return new ApiCallStatus(result);
  }

  setErrors(
    errors: JsonError,
    alertFunc: (msg: AlertMessage) => void
  ): ApiCallStatus<T> {
    sendAlerts(alertFunc, errors);

    return new ApiCallStatus<T>(undefined, errors);
  }
}

export function LoadingStatus<T>(): ApiCallStatus<T> {
  return new ApiCallStatus<T>();
}

export type ApiCallLoadingStatus = {};

export type ApiCallResultStatus<T> = {
  result: T;
};

export type ApiCallErrorsStatus<T> = {
  errors: T;
};
