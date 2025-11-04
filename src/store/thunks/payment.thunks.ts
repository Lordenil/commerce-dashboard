import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CreditCardData, ShippingData } from "../slices/paymentSlice";
import { createCustomerThunk } from "./customer.thunks";

interface SavePaymentDataPayload {
  shipping: ShippingData;
  payment: CreditCardData;
}

export const savePaymentDataWithCustomerThunk = createAsyncThunk(
  "payment/savePaymentDataWithCustomer",
  async (payload: SavePaymentDataPayload, { dispatch }) => {
    try {
      const customerResult = await dispatch(
        createCustomerThunk({
          shippingData: payload.shipping,
        })
      ).unwrap();

      return {
        customerId: customerResult.id,
        shipping: payload.shipping,
        payment: payload.payment,
      };
    } catch (error) {
      throw error;
    }
  }
);
