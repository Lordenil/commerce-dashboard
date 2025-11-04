import { vi, describe, it, expect, beforeEach } from "vitest";
import { createTransactionThunk } from "../../../src/store/thunks/transaction.thunks";
import { TransactionService } from "../../../src/services/transactionService";

vi.mock("../../../src/services/transactionService", () => ({
  TransactionService: {
    createTransaction: vi.fn(),
  },
}));

describe("createTransactionThunk", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();

  const mockPayload = {
    amount: 50000,
    currency: "COP",
    customerId: "cust_123",
    paymentMethod: "credit_card",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería retornar la transacción cuando la creación es exitosa", async () => {
    const mockTransaction = {
      id: "txn_123",
      status: "approved",
      amount: 50000,
    };

    (TransactionService.createTransaction as any).mockResolvedValueOnce(
      mockTransaction
    );

    const thunk = createTransactionThunk(mockPayload);
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(TransactionService.createTransaction).toHaveBeenCalledWith(
      mockPayload
    );
    expect(result.payload).toEqual(mockTransaction);
    expect(result.type).toBe("transaction/createTransaction/fulfilled");
  });

  it("debería retornar un error cuando la API responde con error", async () => {
    const mockError = {
      response: { data: "Error en la API de transacciones" },
    };
    (TransactionService.createTransaction as any).mockRejectedValueOnce(
      mockError
    );

    const thunk = createTransactionThunk(mockPayload);
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(TransactionService.createTransaction).toHaveBeenCalledWith(
      mockPayload
    );
    expect(result.payload).toBe("Error en la API de transacciones");
    expect(result.type).toBe("transaction/createTransaction/rejected");
  });

  it("debería retornar 'Error creating customer' si no hay response en el error", async () => {
    (TransactionService.createTransaction as any).mockRejectedValueOnce(
      new Error("Falla desconocida")
    );

    const thunk = createTransactionThunk(mockPayload);
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(TransactionService.createTransaction).toHaveBeenCalledWith(
      mockPayload
    );
    expect(result.payload).toBe("Error creating customer");
    expect(result.type).toBe("transaction/createTransaction/rejected");
  });
});
