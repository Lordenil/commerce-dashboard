import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Product } from "../../models/Product";
import { CustomerService } from "../../services/customerService";
import { createTransactionThunk } from "../thunks/transaction.thunks";

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
  email: string;
  address: string;
  city: string;
  region: string;
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
  customerId: string | null;
  isCreatingCustomer: boolean;
  customerError: string | null;
  transactionError: string | null;
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
  customerId: null,
  isCreatingCustomer: false,
  customerError: null,
  transactionError: null,
};

interface CreateCustomerPayload {
  shippingData: ShippingData;
}

export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (payload: CreateCustomerPayload, { rejectWithValue }) => {
    try {
      const customerData = {
        name: payload.shippingData.fullName,
        email: payload.shippingData.email,
      };

      const customer = await CustomerService.createCustomer(customerData);
      return customer;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? "Error creating customer");
    }
  }
);

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
    },
    backToPayment: (state) => {
      state.currentStep = "payment";
    },
    confirmPayment: (state) => {
      state.isProcessing = true;
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
    preparePaymentData: (
      state,
      action: PayloadAction<{
        shipping: ShippingData;
        payment: CreditCardData;
      }>
    ) => {
      state.shippingData = action.payload.shipping;
      state.creditCardData = action.payload.payment;
    },
    setCustomerId: (state, action: PayloadAction<string>) => {
      state.customerId = action.payload;
    },
    clearCustomerError: (state) => {
      state.customerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCustomer.pending, (state) => {
        state.isCreatingCustomer = true;
        state.customerError = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isCreatingCustomer = false;
        state.customerId = action.payload.id;
        state.currentStep = "summary";
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isCreatingCustomer = false;
        state.customerError = action.payload as string;
      })
      .addCase(createTransactionThunk.pending, (state) => {
        state.isProcessing = true;
        state.transactionError = null;
      })
      .addCase(createTransactionThunk.fulfilled, (state, action) => {
        state.isProcessing = false;

        if (state.currentTransaction) {
          state.currentTransaction.id = action.payload.id;
          state.currentTransaction.status = action.payload.status;
        }

        state.currentStep = "status";
      })
      .addCase(createTransactionThunk.rejected, (state, action) => {
        state.isProcessing = false;
        state.transactionError = action.payload as string;

        if (state.currentTransaction) {
          state.currentTransaction.status = "failed";
        }
      });
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
  preparePaymentData,
  setCustomerId,
  clearCustomerError,
} = paymentSlice.actions;
export default paymentSlice.reducer;
