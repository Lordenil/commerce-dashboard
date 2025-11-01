import { createAsyncThunk } from "@reduxjs/toolkit";
import { TransactionService } from "../../services/transactionService";
import type { CreateTransaction } from "../../models/CreateTransaction";

export const createTransactionThunk = createAsyncThunk(
  "transaction/createTransaction",
  async (payload: CreateTransaction, { rejectWithValue }) => {
    try {
      const transaction = await TransactionService.createTransaction(payload);
      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? "Error creating customer");
    }
  }
);
