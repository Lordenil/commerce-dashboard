interface ShippingData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  region: string;
  city: string;
  postalCode: string;
}

export interface CreditCardData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentFormData {
  shipping: ShippingData;
  payment: CreditCardData;
  saveCard: boolean;
}
