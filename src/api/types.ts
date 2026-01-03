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
  loading: boolean;
  result?: T;
  errors?: JsonError;

  constructor(loading: boolean, result?: T, errors?: JsonError) {
    this.loading = loading;
    this.result = result;
    this.errors = errors;
  }

  isPending(): this is ApiCallPendingStatus {
    return !this.result && !this.errors && !this.loading;
  }

  isLoading(): this is ApiCallLoadingStatus {
    return !this.result && !this.errors && this.loading;
  }

  isResult(): this is ApiCallResultStatus<T> {
    return this.result !== undefined;
  }

  isErrors(): this is ApiCallErrorsStatus<T> {
    return this.errors !== undefined;
  }

  setLoading(loading: boolean): ApiCallStatus<T> {
    return new ApiCallStatus(loading);
  }

  setResult(result: T): ApiCallStatus<T> {
    return new ApiCallStatus(false, result);
  }

  setErrors(
    errors: JsonError,
    alertFunc: (msg: AlertMessage) => void
  ): ApiCallStatus<T> {
    sendAlerts(alertFunc, errors);

    return new ApiCallStatus<T>(false, undefined, errors);
  }

  hasError(key: string): boolean {
    return (
      !!this.errors &&
      this.errors.errors[key] &&
      this.errors.errors[key].length > 0
    );
  }

  errorText(key: string): string | undefined {
    if (!this.hasError(key)) {
      return;
    }

    return this.errors?.errors[key][0];
  }
}

export function LoadingStatus<T>(loading: boolean = false): ApiCallStatus<T> {
  return new ApiCallStatus<T>(loading);
}

export type ApiCallPendingStatus = { loading: false };
export type ApiCallLoadingStatus = { loading: true };

export type ApiCallResultStatus<T> = {
  result: T;
};

export type ApiCallErrorsStatus<T> = {
  errors: T;
};
