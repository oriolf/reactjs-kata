import { sendAlerts } from "../utils";

export type JsonOk = { ok: boolean };

export type JsonApiError = {
  global: string[];
  fields: { [key: string]: string[] };
};

export type JsonError = {
  errors: JsonApiError;
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

export type TableHeader = {
  key: number;
  label: string;
  width: number;
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
    return this.loading;
  }

  isResult(): this is ApiCallResultStatus<T> {
    return (
      this.result !== undefined && this.errors === undefined && !this.loading
    );
  }

  isErrors(): this is ApiCallErrorsStatus {
    return this.errors !== undefined;
  }

  setLoading(loading: boolean): ApiCallStatus<T> {
    return new ApiCallStatus(loading, this.result, undefined);
  }

  setResult(result: T): ApiCallStatus<T> {
    return new ApiCallStatus(false, result, undefined);
  }

  setErrors(
    errors: JsonError,
    alertFunc?: (msg: AlertMessage) => void
  ): ApiCallStatus<T> {
    if (alertFunc) {
      sendAlerts(alertFunc, errors);
    }

    return new ApiCallStatus<T>(false, this.result, errors);
  }

  hasError(key: string): boolean {
    return (
      !!this.errors &&
      this.errors.errors &&
      this.errors.errors.fields &&
      this.errors.errors.fields[key] &&
      this.errors.errors.fields[key].length > 0
    );
  }

  errorText(key: string): string | undefined {
    if (!this.hasError(key)) {
      return;
    }

    return this.errors?.errors.fields[key][0];
  }
}

export function LoadingStatus<T>(
  loading: boolean = false,
  placeholder?: T
): ApiCallStatus<T> {
  return new ApiCallStatus<T>(loading, placeholder);
}

export type ApiCallPendingStatus = { loading: false };
export type ApiCallLoadingStatus = { loading: true };

export type ApiCallResultStatus<T> = {
  result: T;
};

export type ApiCallErrorsStatus = {
  errors: JsonError;
};

export function IdleEditingStatus(): EditingStatus {
  return new EditingStatus(false, false);
}

export class EditingStatus {
  editing: boolean;
  loading: boolean;
  errors?: JsonError;

  constructor(editing: boolean, loading: boolean, errors?: JsonError) {
    this.editing = editing;
    this.loading = loading;
    this.errors = errors;
  }

  isIdle(): this is EditingIdleStatus {
    return !this.editing && !this.loading && !this.errors;
  }

  isActive(): boolean {
    return this.editing || this.loading || !!this.errors;
  }

  isEditing(): this is EditingActiveStatus {
    return this.editing;
  }

  isLoading(): this is ApiCallLoadingStatus {
    return this.loading;
  }

  isErrors(): this is EditingErrorStatus {
    return this.errors !== undefined;
  }

  setEditing(editing: boolean): EditingStatus {
    return new EditingStatus(editing, false, undefined);
  }

  setLoading(): EditingStatus {
    return new EditingStatus(this.editing, true, undefined);
  }

  setErrors(errors: JsonError): EditingStatus {
    return new EditingStatus(this.editing, false, errors);
  }

  clearErrors(): EditingStatus {
    return new EditingStatus(this.editing, false, {
      errors: { global: [], fields: {} },
    });
  }

  hasError(key: string): boolean {
    const e = this.errors;
    return (
      !!e &&
      ((e.errors.fields &&
        e.errors.fields[key] &&
        e.errors.fields[key].length > 0) ||
        (e.errors.global && e.errors.global.length > 0))
    );
  }

  errorText(key: string): string | undefined {
    if (!this.isErrors() || !this.hasError(key)) {
      return;
    }

    let errs = this.errors?.errors;
    return errs.fields[key] ? errs.fields[key][0] : errs.global[0];
  }
}

export type EditingIdleStatus = { editing: false };
export type EditingActiveStatus = { editing: true };

export type EditingErrorStatus = {
  errors: JsonError;
};
