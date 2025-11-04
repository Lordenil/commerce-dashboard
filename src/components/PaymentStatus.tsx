import React from "react";
import { usePayment } from "../common";

export const PaymentStatus: React.FC = () => {
  const { currentTransaction, closePaymentModal } = usePayment();

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
        <svg
          className="w-8 h-8 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        ¡Pago Exitoso!
      </h2>

      <p className="text-gray-600 dark:text-gray-300">
        Tu pedido ha sido procesado correctamente.
      </p>

      {currentTransaction && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Detalles de la Transacción
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">ID:</span>
              <span className="text-gray-800 dark:text-white font-mono">
                {currentTransaction.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Producto:
              </span>
              <span className="text-gray-800 dark:text-white">
                {currentTransaction.productName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Monto:</span>
              <span className="text-green-600 font-bold">
                ${currentTransaction.amount}
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={closePaymentModal}
        className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Cerrar
      </button>
    </div>
  );
};
