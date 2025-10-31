import { http } from "../common";

const createPayment = async () => {
  const response = await http.post("/payments", {});
  return response.data;
};

export const PaymentService = {
  createPayment,
};
