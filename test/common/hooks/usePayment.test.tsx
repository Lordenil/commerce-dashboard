import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import paymentReducer, {
  openPaymentModal,
  closePaymentModal,
  preparePaymentData,
  backToPayment,
  setCustomerId,
  clearCustomerError,
} from "../../../src/store/slices/paymentSlice";

import { usePayment } from "../../../src/common/hooks/usePayment";

vi.mock("../../../src/store/thunks/customer.thunks", () => ({
  createCustomerThunk: Object.assign(vi.fn(), {
    pending: { type: "customer/createCustomer/pending" },
    fulfilled: { type: "customer/createCustomer/fulfilled" },
    rejected: { type: "customer/createCustomer/rejected" },
  }),
}));

vi.mock("../../../src/store/thunks/payment.thunks", () => ({
  savePaymentDataWithCustomerThunk: Object.assign(vi.fn(), {
    pending: { type: "payment/savePaymentDataWithCustomer/pending" },
    fulfilled: { type: "payment/savePaymentDataWithCustomer/fulfilled" },
    rejected: { type: "payment/savePaymentDataWithCustomer/rejected" },
  }),
}));

vi.mock("../../../src/store/thunks/transaction.thunks", () => ({
  createTransactionThunk: Object.assign(vi.fn(), {
    pending: { type: "transaction/createTransaction/pending" },
    fulfilled: { type: "transaction/createTransaction/fulfilled" },
    rejected: { type: "transaction/createTransaction/rejected" },
  }),
}));

import { createCustomerThunk } from "../../../src/store/thunks/customer.thunks";
import { savePaymentDataWithCustomerThunk } from "../../../src/store/thunks/payment.thunks";
import { createTransactionThunk } from "../../../src/store/thunks/transaction.thunks";

describe("usePayment hook", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: { payment: paymentReducer },
      preloadedState: {
        payment: {
          customerId: null,
          transactions: [],
          currentTransaction: null,
          isPaymentModalOpen: false,
          selectedProduct: null,
          currentStep: 1,
          shippingData: null,
          creditCardData: null,
          isProcessing: false,
          error: null,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: any) => (
    <Provider store={store}>{children}</Provider>
  );

  it("debería abrir y cerrar el modal de pago", () => {
    const { result } = renderHook(() => usePayment(), { wrapper });

    act(() => {
      result.current.openPaymentModal({ id: 1, name: "Producto test" });
    });
    expect(store.getState().payment.isPaymentModalOpen).toBe(true);

    act(() => {
      result.current.closePaymentModal();
    });
    expect(store.getState().payment.isPaymentModalOpen).toBe(false);
  });

  it("debería preparar los datos de pago", () => {
    const { result } = renderHook(() => usePayment(), { wrapper });

    const mockShipping = {
      fullName: "Juan Pérez",
      address: "Calle 123",
      city: "Bogotá",
      postalCode: "110111",
      country: "Colombia",
      phone: "3001234567",
      email: "juan@example.com",
      region: "Cundinamarca",
    };

    const mockPayment = {
      cardNumber: "4111111111111111",
      expMonth: "12",
      expYear: "25",
      cvc: "123",
    };

    act(() => {
      result.current.preparePaymentData(mockShipping, mockPayment);
    });

    const state = store.getState().payment;
    expect(state.shippingData).toEqual(mockShipping);
    expect(state.creditCardData).toEqual(mockPayment);
  });

  it("debería lanzar error si faltan datos al confirmar el pago", async () => {
    const { result } = renderHook(() => usePayment(), { wrapper });

    await expect(result.current.confirmPayment()).rejects.toThrow(
      "Datos incompletos para procesar el pago"
    );
  });

  it("debería establecer el customerId correctamente", () => {
    const { result } = renderHook(() => usePayment(), { wrapper });

    act(() => {
      result.current.setCustomerId("cust_123");
    });

    expect(store.getState().payment.customerId).toBe("cust_123");
  });

  it("debería limpiar los errores del cliente", () => {
    const { result } = renderHook(() => usePayment(), { wrapper });

    act(() => {
      result.current.clearCustomerError();
    });

    expect(store.getState().payment.error).toBeNull();
  });
});
