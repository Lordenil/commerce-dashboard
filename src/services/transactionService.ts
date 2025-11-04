import { http } from "../common";
import type { CreateTransaction } from "../models/CreateTransaction";

const createTransaction = async (body: CreateTransaction) => {
  const response = await http.post("/transactions", body);
  return response.data;
};

export const TransactionService = {
  createTransaction,
};
