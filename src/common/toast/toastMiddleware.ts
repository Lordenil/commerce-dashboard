import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const toastMiddleware = () => (next: any) => (action: any) => {
  if (isRejectedWithValue(action)) {
    const message = action.payload ?? "Ocurrió un error inesperado.";
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
    });
  }
  return next(action);
};
