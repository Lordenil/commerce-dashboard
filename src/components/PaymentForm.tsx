import { useState } from "react";
import type {
  CreditCardData,
  ShippingData,
} from "../store/slices/paymentSlice";
import type { Product } from "../models/Product";

interface PaymentFormProps {
  onClose: () => void;
  product: Product;
  onSavePaymentData: (shipping: ShippingData, payment: CreditCardData) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onClose,
  product,
  onSavePaymentData,
}) => {
  const [shippingData, setShippingData] = useState<ShippingData>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [creditCardData, setCreditCardData] = useState<CreditCardData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const [saveCard, setSaveCard] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePaymentData(shippingData, creditCardData);
  };

  const handleShippingChange = (field: keyof ShippingData, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof CreditCardData, value: string) => {
    setCreditCardData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-lg mb-2">
          Producto seleccionado:
        </h3>
        <p className="text-gray-700 dark:text-gray-300">{product?.name}</p>
        <p className="text-green-600 font-bold text-xl">${product?.price}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Datos de Envío
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre completo"
              value={shippingData.fullName}
              onChange={(e) => handleShippingChange("fullName", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={shippingData.phone}
              onChange={(e) => handleShippingChange("phone", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={shippingData.email}
              onChange={(e) => handleShippingChange("email", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Dirección"
              value={shippingData.address}
              onChange={(e) => handleShippingChange("address", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={shippingData.city}
              onChange={(e) => handleShippingChange("city", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Código Postal"
              value={shippingData.postalCode}
              onChange={(e) =>
                handleShippingChange("postalCode", e.target.value)
              }
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="País"
              value={shippingData.country}
              onChange={(e) => handleShippingChange("country", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Datos de Pago
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Número de Tarjeta"
              value={creditCardData.cardNumber}
              onChange={(e) =>
                handlePaymentChange("cardNumber", e.target.value)
              }
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              maxLength={19}
              required
            />
            <input
              type="text"
              placeholder="Titular de la Tarjeta"
              value={creditCardData.cardHolder}
              onChange={(e) =>
                handlePaymentChange("cardHolder", e.target.value)
              }
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="MM/AA"
              value={creditCardData.expiryDate}
              onChange={(e) =>
                handlePaymentChange("expiryDate", e.target.value)
              }
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              maxLength={5}
              required
            />
            <input
              type="text"
              placeholder="CVV"
              value={creditCardData.cvv}
              onChange={(e) => handlePaymentChange("cvv", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              maxLength={4}
              required
            />
          </div>
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-500 "
              />
              <span className="text-gray-700 dark:border-gray-600 rounded-lg  dark:text-white">
                Guardar información de tarjeta para futuras compras
              </span>
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continuar al Resumen
          </button>
        </div>
      </form>
    </div>
  );
};
