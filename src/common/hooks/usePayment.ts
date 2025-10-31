import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import type { AppDispatch, RootState } from "../../store";
import {
  openPaymentModal,
  closePaymentModal,
  savePaymentData,
  confirmPayment,
  paymentComplete,
  backToPayment,
  type ShippingData,
  type CreditCardData,
} from "../../store/slices/paymentSlice";

export const usePayment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
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

  const handleSavePaymentData = useCallback(
    (shipping: ShippingData, payment: CreditCardData) => {
      dispatch(savePaymentData({ shipping, payment }));
    },
    [dispatch]
  );

  const handleBackToPayment = useCallback(() => {
    dispatch(backToPayment());
  }, [dispatch]);

  const handleConfirmPayment = useCallback(() => {
    dispatch(confirmPayment());

    setTimeout(() => {
      dispatch(paymentComplete({ status: "completed" }));
    }, 2000);
  }, [dispatch]);

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
    backToPayment: handleBackToPayment,
    confirmPayment: handleConfirmPayment,
  };
};
