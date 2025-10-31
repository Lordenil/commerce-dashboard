import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  openPaymentModal,
  closePaymentModal,
  addTransaction,
  updateTransactionStatus,
  clearCurrentTransaction,
  type ShippingData,
  type CreditCardData,
} from "../../store/slices/paymentSlice";
import type { AppDispatch, RootState } from "../../store";
import type { Product } from "../../models/Product";

export const usePayment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    transactions,
    currentTransaction,
    isPaymentModalOpen,
    selectedProduct,
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

  const processPayment = useCallback(
    (product: Product, shipping: ShippingData, payment: CreditCardData) => {
      dispatch(addTransaction({ product, shipping, payment }));

      setTimeout(() => {
        dispatch(
          updateTransactionStatus({
            id: `txn_${Date.now()}`,
            status: "completed",
          })
        );
      }, 2000);
    },
    [dispatch]
  );

  const clearTransaction = useCallback(() => {
    dispatch(clearCurrentTransaction());
  }, [dispatch]);

  return {
    transactions,
    currentTransaction,
    isPaymentModalOpen,
    selectedProduct,
    openPaymentModal: handleOpenPaymentModal,
    closePaymentModal: handleClosePaymentModal,
    processPayment,
    clearTransaction,
  };
};
