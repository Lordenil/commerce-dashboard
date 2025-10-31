import { usePayment } from "../common";

export const PaymentSummary: React.FC = () => {
  const {
    selectedProduct,
    shippingData,
    creditCardData,
    isProcessing,
    confirmPayment,
    backToPayment,
  } = usePayment();

  if (!selectedProduct || !shippingData || !creditCardData) {
    return <div>Error: Datos incompletos</div>;
  }

  const maskCreditCard = (cardNumber: string) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Resumen de Compra
      </h2>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Producto
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white">
                {selectedProduct.name}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {selectedProduct.description}
              </p>
            </div>
            <p className="text-lg font-bold text-green-600">
              ${selectedProduct.price}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Dirección de Envío
          </h3>
          <button
            onClick={backToPayment}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
          >
            Editar
          </button>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-gray-800 dark:text-white">
            {shippingData.fullName}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {shippingData.address}, {shippingData.city}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {shippingData.postalCode}, {shippingData.country}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            📞 {shippingData.phone}
          </p>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Método de Pago
          </h3>
          <button
            onClick={backToPayment}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
          >
            Editar
          </button>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-gray-800 dark:text-white">Tarjeta de Crédito</p>
          <p className="text-gray-600 dark:text-gray-300">
            {maskCreditCard(creditCardData.cardNumber)}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Titular: {creditCardData.cardHolder}
          </p>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span className="text-gray-800 dark:text-white">Total</span>
          <span className="text-green-600">${selectedProduct.price}</span>
        </div>
      </div>
      <div className="flex space-x-4 pt-4">
        <button
          onClick={backToPayment}
          className="flex-1 px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Volver
        </button>
        <button
          onClick={confirmPayment}
          disabled={isProcessing}
          className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Procesando...
            </>
          ) : (
            "Confirmar y Pagar"
          )}
        </button>
      </div>
    </div>
  );
};
