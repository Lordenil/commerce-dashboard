import { http } from "../common";
import type { CreateTransaction } from "../models/CreateTransaction";

const createTransaction = async (body: CreateTransaction) => {
  try {
    const response = await http.post("/transactions", body);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Error al crear la transacción";

    throw new Error(message);
  }
};

export const TransactionService = {
  createTransaction,
};
