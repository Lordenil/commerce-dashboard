import { describe, it, expect, vi, beforeEach } from "vitest";
import paymentReducer, {
  openPaymentModal,
  closePaymentModal,
  savePaymentData,
  confirmPayment,
  paymentComplete,
  backToPayment,
  finishPaymentFlow,
  setCurrentStep,
  addTransaction,
  updateTransactionStatus,
  clearCurrentTransaction,
  preparePaymentData,
  setCustomerId,
  clearCustomerError,
  createCustomer,
} from "../../../src/store/slices/paymentSlice";
import { createTransactionThunk } from "../../../src/store/thunks/transaction.thunks";
import { CustomerService } from "../../../src/services/customerService";

vi.mock("../../../src/services/customerService", () => ({
  CustomerService: {
    createCustomer: vi.fn(),
  },
}));

vi.mock("../../../src/store/thunks/transaction.thunks", () => ({
  createTransactionThunk: {
    pending: { type: "transaction/pending" },
    fulfilled: { type: "transaction/fulfilled" },
    rejected: { type: "transaction/rejected" },
  },
}));

describe("paymentSlice", () => {
  const initialState = {
    transactions: [],
    currentTransaction: null,
    isPaymentModalOpen: false,
    selectedProduct: null,
    currentStep: "payment",
    shippingData: null,
    creditCardData: null,
    isProcessing: false,
    customerId: null,
    isCreatingCustomer: false,
    customerError: null,
    transactionError: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ Reducers sincrónicos
  it("should open payment modal", () => {
    const product = { id: "p1", name: "Producto", price: 1000 };
    const state = paymentReducer(initialState, openPaymentModal(product));
    expect(state.isPaymentModalOpen).toBe(true);
    expect(state.selectedProduct).toEqual(product);
  });

  it("should close payment modal", () => {
    const prev = {
      ...initialState,
      isPaymentModalOpen: true,
      selectedProduct: { id: "1" },
    };
    const state = paymentReducer(prev, closePaymentModal());
    expect(state.isPaymentModalOpen).toBe(false);
    expect(state.selectedProduct).toBeNull();
  });

  it("should save payment data", () => {
    const shipping = {
      fullName: "Juan",
      email: "a@a.com",
      address: "Calle 1",
      city: "Bogotá",
      postalCode: "123",
      country: "CO",
      phone: "300",
    };
    const payment = {
      cardNumber: "1234",
      cardHolder: "Juan",
      expiryDate: "12/28",
      cvv: "123",
    };
    const state = paymentReducer(
      initialState,
      savePaymentData({ shipping, payment })
    );
    expect(state.shippingData).toEqual(shipping);
    expect(state.creditCardData).toEqual(payment);
  });

  it("should mark payment as processing on confirmPayment", () => {
    const state = paymentReducer(initialState, confirmPayment());
    expect(state.isProcessing).toBe(true);
  });

  it("should complete payment and update transaction status", () => {
    const prev = {
      ...initialState,
      currentTransaction: { id: "t1", status: "pending" },
      transactions: [{ id: "t1", status: "pending" }],
    };
    const state = paymentReducer(
      prev,
      paymentComplete({ status: "completed" })
    );
    expect(state.currentTransaction?.status).toBe("completed");
    expect(state.transactions[0].status).toBe("completed");
  });

  it("should add a new transaction", () => {
    const product = { id: "1", name: "Laptop", price: 1000 };
    const shipping = {
      fullName: "J",
      email: "x",
      address: "a",
      city: "b",
      postalCode: "1",
      country: "c",
      phone: "2",
    };
    const payment = {
      cardNumber: "1111",
      cardHolder: "J",
      expiryDate: "12/28",
      cvv: "123",
    };

    const state = paymentReducer(
      initialState,
      addTransaction({ product, shipping, payment })
    );
    expect(state.transactions.length).toBe(1);
    expect(state.currentTransaction).not.toBeNull();
    expect(state.currentStep).toBe("status");
  });

  it("should update transaction status", () => {
    const prev = {
      ...initialState,
      transactions: [{ id: "t1", status: "pending" }],
    };
    const state = paymentReducer(
      prev,
      updateTransactionStatus({ id: "t1", status: "failed" })
    );
    expect(state.transactions[0].status).toBe("failed");
  });

  it("should clear current transaction", () => {
    const prev = { ...initialState, currentTransaction: { id: "t1" } };
    const state = paymentReducer(prev, clearCurrentTransaction());
    expect(state.currentTransaction).toBeNull();
  });

  it("should prepare payment data", () => {
    const data = {
      shipping: {
        fullName: "A",
        email: "x",
        address: "1",
        city: "2",
        postalCode: "3",
        country: "4",
        phone: "5",
      },
      payment: {
        cardNumber: "1",
        cardHolder: "A",
        expiryDate: "12/30",
        cvv: "123",
      },
    };
    const state = paymentReducer(initialState, preparePaymentData(data));
    expect(state.shippingData).toEqual(data.shipping);
    expect(state.creditCardData).toEqual(data.payment);
  });

  it("should set customerId", () => {
    const state = paymentReducer(initialState, setCustomerId("abc"));
    expect(state.customerId).toBe("abc");
  });

  it("should clear customer error", () => {
    const prev = { ...initialState, customerError: "Error" };
    const state = paymentReducer(prev, clearCustomerError());
    expect(state.customerError).toBeNull();
  });

  // ✅ Thunk: createCustomer
  it("should handle createCustomer.pending", () => {
    const state = paymentReducer(initialState, {
      type: createCustomer.pending.type,
    });
    expect(state.isCreatingCustomer).toBe(true);
    expect(state.customerError).toBeNull();
  });

  it("should handle createCustomer.fulfilled", () => {
    const state = paymentReducer(initialState, {
      type: createCustomer.fulfilled.type,
      payload: { id: "cust_123" },
    });
    expect(state.isCreatingCustomer).toBe(false);
    expect(state.customerId).toBe("cust_123");
    expect(state.currentStep).toBe("summary");
  });

  it("should handle createCustomer.rejected", () => {
    const state = paymentReducer(initialState, {
      type: createCustomer.rejected.type,
      payload: "Error creating customer",
    });
    expect(state.isCreatingCustomer).toBe(false);
    expect(state.customerError).toBe("Error creating customer");
  });

  // ✅ Thunk: createTransactionThunk
  it("should handle createTransactionThunk.pending", () => {
    const state = paymentReducer(initialState, {
      type: createTransactionThunk.pending.type,
    });
    expect(state.isProcessing).toBe(true);
  });

  it("should handle createTransactionThunk.fulfilled", () => {
    const prev = {
      ...initialState,
      currentTransaction: { id: "t1", status: "pending" },
    };
    const state = paymentReducer(prev, {
      type: createTransactionThunk.fulfilled.type,
      payload: { id: "t1", status: "completed" },
    });
    expect(state.isProcessing).toBe(false);
    expect(state.currentTransaction?.status).toBe("completed");
    expect(state.currentStep).toBe("status");
  });

  it("should handle createTransactionThunk.rejected", () => {
    const prev = {
      ...initialState,
      currentTransaction: { id: "t1", status: "pending" },
    };
    const state = paymentReducer(prev, {
      type: createTransactionThunk.rejected.type,
      payload: "Network error",
    });
    expect(state.isProcessing).toBe(false);
    expect(state.transactionError).toBe("Network error");
    expect(state.currentTransaction?.status).toBe("failed");
  });
});
