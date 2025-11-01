import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import type { AppDispatch, RootState } from "../../store";
import {
  openPaymentModal,
  closePaymentModal,
  backToPayment,
  preparePaymentData,
  setCustomerId,
  clearCustomerError,
  type ShippingData,
  type CreditCardData,
} from "../../store/slices/paymentSlice";
import { createCustomerThunk } from "../../store/thunks/customer.thunks";
import { savePaymentDataWithCustomerThunk } from "../../store/thunks/payment.thunks";
import { createTransactionThunk } from "../../store/thunks/transaction.thunks";
import type { CreateTransaction } from "../../models/CreateTransaction";

export const usePayment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    customerId,
    transactions,
    currentTransaction,
    isPaymentModalOpen,
    selectedProduct,
    currentStep,
    shippingData,
    creditCardData,
    isProcessing,
  } = useSelector((state: RootState) => state.payment);

  const handleOpenPaymentModal = useCallback(
    (product: any) => {
      dispatch(openPaymentModal(product));
    },
    [dispatch]
  );

  const handleClosePaymentModal = useCallback(() => {
    dispatch(closePaymentModal());
  }, [dispatch]);

  const handlePreparePaymentData = useCallback(
    (shipping: ShippingData, payment: CreditCardData) => {
      dispatch(preparePaymentData({ shipping, payment }));
    },
    [dispatch]
  );

  const handleSavePaymentData = useCallback(
    async (shipping: ShippingData, payment: CreditCardData) => {
      dispatch(preparePaymentData({ shipping, payment }));
      try {
        await dispatch(
          savePaymentDataWithCustomerThunk({ shipping, payment })
        ).unwrap();
      } catch (error) {
        console.error("Error saving payment data:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const handleCreateCustomer = useCallback(async () => {
    if (!shippingData) {
      throw new Error("Shipping data is required");
    }

    try {
      await dispatch(createCustomerThunk({ shippingData })).unwrap();
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  }, [dispatch, shippingData]);

  const handleBackToPayment = useCallback(() => {
    dispatch(backToPayment());
  }, [dispatch]);

  const handleSetCustomerId = useCallback(
    (customerId: string) => {
      dispatch(setCustomerId(customerId));
    },
    [dispatch]
  );

  const handleClearCustomerError = useCallback(() => {
    dispatch(clearCustomerError());
  }, [dispatch]);

  const handleConfirmPayment = useCallback(async () => {
    if (!customerId || !selectedProduct || !shippingData || !creditCardData) {
      throw new Error("Datos incompletos para procesar el pago");
    }

    try {
      const payload: CreateTransaction = {
        customerId: customerId,
        productId: selectedProduct.id,
        amount: selectedProduct.price,
        currency: selectedProduct.currency ?? "COP",
        type: "CARD",
        token: creditCardData.cardNumber,
        installments: 0,
        fullName: shippingData.fullName,
        address: shippingData.address,
        city: shippingData.city,
        postalCode: shippingData.postalCode,
        country: shippingData.country,
        phone: shippingData.phone,
        email: shippingData.email,
      };

      const result = await dispatch(createTransactionThunk(payload)).unwrap();
      return result;
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw error;
    }
  }, [dispatch, customerId, selectedProduct, shippingData, creditCardData]);

  return {
    transactions,
    currentTransaction,
    isPaymentModalOpen,
    selectedProduct,
    currentStep,
    shippingData,
    creditCardData,
    isProcessing,
    openPaymentModal: handleOpenPaymentModal,
    closePaymentModal: handleClosePaymentModal,
    savePaymentData: handleSavePaymentData,
    preparePaymentData: handlePreparePaymentData,
    createCustomer: handleCreateCustomer,
    backToPayment: handleBackToPayment,
    confirmPayment: handleConfirmPayment,
    setCustomerId: handleSetCustomerId,
    clearCustomerError: handleClearCustomerError,
  };
};
