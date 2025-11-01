import { createAsyncThunk } from "@reduxjs/toolkit";
import { CustomerService } from "../../services/customerService";
import type { ShippingData } from "../slices/paymentSlice";

interface CreateCustomerPayload {
  shippingData: ShippingData;
}

export const createCustomerThunk = createAsyncThunk(
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
