import { http } from "../common";
import type { CreateCustomer } from "../models/CreateCustomer";

const createCustomer = async (body: CreateCustomer) => {
  const response = await http.post("/customers", body);
  return response.data;
};

export const CustomerService = {
  createCustomer,
};
