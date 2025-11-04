export interface CreateTransaction {
  customerId: string;
  productId: string;
  amount: number;
  currency: string;
  type: string;
  numberCard: string;
  expYear: string;
  expMonth: string;
  cvc: string;
  installments: number;
  fullName: string;
  address: string;
  country: string;
  region: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
}
