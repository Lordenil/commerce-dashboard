import { QueryClient } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { throwUnexpectedError } from "../common";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => processError(error, true),
    },
    queries: {
      refetchOnWindowFocus: false,
      onError: (error) => processError(error),
    },
  },
});

const processError = (error: any, isMutation = false) => {
  if (error?.response?.status === HttpStatusCode.Forbidden) {
    if (isMutation) {
      throwUnexpectedError("Usuario no autorizado para realizar esta acción.");
    } else {
      window.location.href = "/";
    }
  } else {
    throwUnexpectedError("Ha ocurrido un error inesperado.");
  }
};
