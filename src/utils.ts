import { AlertMessage, isError, JsonError } from "./api/types";
import { NewAlertMessage } from "./App";

export function sendAlerts(
  alertFunc: (msg: AlertMessage) => void,
  data: JsonError
) {
  if (isError(data)) {
    let formErrors = data.errors["__form__"];
    if (formErrors) {
      for (let msg of formErrors) {
        alertFunc(NewAlertMessage(msg));
      }
    }
  }
}

export function debounce(
  f: (x: any) => void,
  timeout: number
): (x: any) => void {
  let timer: number;
  return (x: any) => {
    clearInterval(timer);
    timer = setTimeout(() => f(x), timeout);
  };
}
