import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

export interface PaymentTransaction {
  id: string;
  productId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  timestamp: string;
  customerEmail: string;
}

interface PaymentState {
  transactions: PaymentTransaction[];
  currentTransaction: PaymentTransaction | null;
  isPaymentModalOpen: boolean;
  selectedProduct: any;
}

const initialState: PaymentState = {
  transactions: [],
  currentTransaction: null,
  isPaymentModalOpen: false,
  selectedProduct: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    openPaymentModal: (state, action: PayloadAction<any>) => {
      state.isPaymentModalOpen = true;
      state.selectedProduct = action.payload;
    },
    closePaymentModal: (state) => {
      state.isPaymentModalOpen = false;
      state.selectedProduct = null;
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
  addTransaction,
  updateTransactionStatus,
  clearCurrentTransaction,
} = paymentSlice.actions;
export default paymentSlice.reducer;
