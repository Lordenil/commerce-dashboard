import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { Envs } from "../../config/environments";

export const http = axios.create({
  baseURL: Envs.url,
});
http.defaults.headers.post["Content-Type"] = "application/json";
http.defaults.headers.put["Content-Type"] = "application/json";
http.defaults.headers.delete["Content-Type"] = "application/json";

export const throwUnexpectedError = (message: string) => {
  enqueueSnackbar(message, {
    variant: "warning",
  });
};
