import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../models/Product";

export type PaymentStep = "payment" | "summary" | "status";

export interface PaymentTransaction {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  timestamp: string;
  customerEmail: string;
  shippingData?: ShippingData;
}

export interface ShippingData {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CreditCardData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentState {
  transactions: PaymentTransaction[];
  currentTransaction: PaymentTransaction | null;
  isPaymentModalOpen: boolean;
  selectedProduct: Product | null;
  currentStep: string;
  shippingData: ShippingData | null;
  creditCardData: CreditCardData | null;
  isProcessing: boolean;
}

const initialState: PaymentState = {
  transactions: [],
  currentTransaction: null,
  isPaymentModalOpen: false,
  selectedProduct: null,
  currentStep: "payment",
  shippingData: null,
  creditCardData: null,
  isProcessing: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    openPaymentModal: (state, action: PayloadAction<any>) => {
      state.isPaymentModalOpen = true;
      state.selectedProduct = action.payload;
      state.currentStep = "payment";
      state.shippingData = null;
      state.creditCardData = null;
      state.isProcessing = false;
    },
    closePaymentModal: (state) => {
      state.isPaymentModalOpen = false;
      state.selectedProduct = null;
      state.currentStep = "payment";
      state.shippingData = null;
      state.creditCardData = null;
      state.currentTransaction = null;
      state.isProcessing = false;
    },
    savePaymentData: (
      state,
      action: PayloadAction<{
        shipping: ShippingData;
        payment: CreditCardData;
      }>
    ) => {
      state.shippingData = action.payload.shipping;
      state.creditCardData = action.payload.payment;
      state.currentStep = "summary";
    },
    backToPayment: (state) => {
      state.currentStep = "payment";
    },
    confirmPayment: (state) => {
      if (state.selectedProduct && state.shippingData && state.creditCardData) {
        state.isProcessing = true;

        const newTransaction: PaymentTransaction = {
          id: `txn_${Date.now()}`,
          productId: state.selectedProduct.id,
          productName: state.selectedProduct.name,
          amount: state.selectedProduct.price,
          currency: "USD",
          status: "pending",
          timestamp: new Date().toISOString(),
          customerEmail: "customer@example.com",
          shippingData: state.shippingData,
        };

        state.transactions.push(newTransaction);
        state.currentTransaction = newTransaction;
      }
    },
    paymentComplete: (
      state,
      action: PayloadAction<{
        status: "completed" | "failed";
      }>
    ) => {
      state.isProcessing = false;
      state.currentStep = "status";

      if (state.currentTransaction) {
        state.currentTransaction.status = action.payload.status;

        const transaction = state.transactions.find(
          (t) => t.id === state.currentTransaction?.id
        );
        if (transaction) {
          transaction.status = action.payload.status;
        }
      }
    },
    finishPaymentFlow: (state) => {
      state.currentStep = "payment";
      state.selectedProduct = null;
      state.shippingData = null;
      state.creditCardData = null;
      state.currentTransaction = null;
      state.isProcessing = false;
    },
    setCurrentStep: (state, action: PayloadAction<PaymentStep>) => {
      state.currentStep = action.payload;
    },
    addTransaction: (
      state,
      action: PayloadAction<{
        product: any;
        shipping: ShippingData;
        payment: CreditCardData;
      }>
    ) => {
      const newTransaction: PaymentTransaction = {
        id: `txn_${Date.now()}`,
        productId: action.payload.product.id,
        productName: action.payload.product.name,
        amount: action.payload.product.price,
        currency: "USD",
        status: "pending",
        timestamp: new Date().toISOString(),
        customerEmail: "customer@example.com",
        shippingData: action.payload.shipping,
      };
      state.transactions.push(newTransaction);
      state.currentTransaction = newTransaction;
      state.isPaymentModalOpen = false;
      state.selectedProduct = null;
      state.currentStep = "status";
    },
    updateTransactionStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: PaymentTransaction["status"];
      }>
    ) => {
      const transaction = state.transactions.find(
        (t) => t.id === action.payload.id
      );
      if (transaction) {
        transaction.status = action.payload.status;
      }
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
  },
});

export const {
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
} = paymentSlice.actions;
export default paymentSlice.reducer;
