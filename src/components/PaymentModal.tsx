import { PaymentForm } from "./PaymentForm";
import { PaymentSummary } from "./PaymentSumary";
import { usePayment } from "../common";
import type { Product } from "../models/Product";
import { PaymentStatus } from "./PaymentStatus";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const {
    currentStep,
    closePaymentModal,
    savePaymentData,
    shippingData,
    creditCardData,
  } = usePayment();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "payment":
        return (
          <PaymentForm
            onClose={closePaymentModal}
            product={product}
            onSavePaymentData={savePaymentData}
            shippingSavedData={shippingData}
            creditCardSavedData={creditCardData}
          />
        );
      case "summary":
        return <PaymentSummary />;
      case "status":
        return <PaymentStatus />;
      default:
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white  dark:bg-gray-800 rounded-lg p-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold dark:text-gray-300 text-gray-800">
            Completar Compra
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        {renderCurrentStep()}
      </div>
    </div>
  );
};
