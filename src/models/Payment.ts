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

export interface PaymentFormData {
  shipping: ShippingData;
  payment: CreditCardData;
  saveCard: boolean;
}
