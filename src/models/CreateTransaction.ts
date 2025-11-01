export interface CreateTransaction {
  customerId: string;
  productId: string;
  amount: number;
  currency: string;
  type: string;
  token: string;
  installments: number;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}
