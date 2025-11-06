import { useState } from "react";
import type {
  CreditCardData,
  ShippingData,
} from "../store/slices/paymentSlice";
import type { Product } from "../models/Product";
import { useForm } from "react-hook-form";

interface PaymentFormProps {
  onClose: () => void;
  product: Product;
  onSavePaymentData: (shipping: ShippingData, payment: CreditCardData) => void;
  shippingSavedData: ShippingData;
  creditCardSavedData: CreditCardData;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onClose,
  product,
  onSavePaymentData,
  shippingSavedData,
  creditCardSavedData,
}) => {
  const [shippingData, setShippingData] = useState<ShippingData>({
    fullName: shippingSavedData?.fullName ?? "",
    email: shippingSavedData?.email ?? "",
    address: shippingSavedData?.address ?? "",
    city: shippingSavedData?.city ?? "",
    postalCode: shippingSavedData?.postalCode ?? "",
    country: shippingSavedData?.country ?? "",
    region: shippingSavedData?.region ?? "",
    phone: shippingSavedData?.phone ?? "",
  });

  const [creditCardData, setCreditCardData] = useState<CreditCardData>({
    cardNumber: creditCardSavedData?.cardNumber ?? "",
    cardHolder: creditCardSavedData?.cardHolder ?? "",
    expiryDate: creditCardSavedData?.expiryDate ?? "",
    cvv: creditCardSavedData?.cvv ?? "",
  });

  const onSubmit = (data: { shipping: ShippingData; card: CreditCardData }) => {
    onSavePaymentData(data.shipping, data.card);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ shipping: ShippingData; card: CreditCardData }>();

  const handleShippingChange = (field: keyof ShippingData, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof CreditCardData, value: string) => {
    setCreditCardData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div className="w-full">
      <div className="mb-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-800 dark:text-gray-300 text-lg mb-2">
          Producto seleccionado:
        </h3>
        <p className="text-gray-700 dark:text-gray-300">{product?.name}</p>
        <p className="text-green-600 font-bold text-xl">${product?.price}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div>
          <h3 className="text-lg font-semibold mb-1 mt-4 text-gray-800 dark:text-gray-300">
            Datos de Envío
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Nombre completo"
              {...register("shipping.fullName", {
                required: "Campo obligatorio",
              })}
              value={shippingData.fullName}
              onChange={(e) => handleShippingChange("fullName", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.shipping?.fullName && (
              <p className="text-red-500 text-sm">
                {errors.shipping.fullName.message}
              </p>
            )}

            <input
              type="tel"
              placeholder="Teléfono"
              {...register("shipping.phone", {
                required: "Campo obligatorio",
                pattern: {
                  value: /\d{10}$/,
                  message: "Ingresa un número de teléfono válido",
                },
                minLength: { value: 10, message: "Mínimo 10 dígitos" },
              })}
              value={shippingData.phone}
              onChange={(e) => handleShippingChange("phone", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.shipping?.phone && (
              <p className="text-red-500 text-sm">
                {errors.shipping.phone.message}
              </p>
            )}
            <input
              type="text"
              placeholder="Email"
              {...register("shipping.email", {
                required: "Campo obligatorio",
                pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
              })}
              value={shippingData.email}
              onChange={(e) => handleShippingChange("email", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.shipping?.email && (
              <p className="text-red-500 text-sm">
                {errors.shipping.email.message}
              </p>
            )}
            <input
              type="text"
              placeholder="Dirección"
              {...register("shipping.address", {
                required: "Campo obligatorio",
              })}
              value={shippingData.address}
              onChange={(e) => handleShippingChange("address", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.shipping?.address && (
              <p className="text-red-500 text-sm">
                {errors.shipping.address.message}
              </p>
            )}
            <input
              type="text"
              placeholder="País"
              {...register("shipping.country", {
                required: "Campo obligatorio",
              })}
              value={shippingData.country}
              onChange={(e) => handleShippingChange("country", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.shipping?.country && (
              <p className="text-red-500 text-sm">
                {errors.shipping.country.message}
              </p>
            )}
            <input
              type="text"
              placeholder="Región"
              {...register("shipping.region", {
                required: "Campo obligatorio",
              })}
              value={shippingData.region}
              onChange={(e) => handleShippingChange("region", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.shipping?.region && (
              <p className="text-red-500 text-sm">
                {errors.shipping.region.message}
              </p>
            )}
            <input
              type="text"
              placeholder="Ciudad"
              {...register("shipping.city", { required: "Campo obligatorio" })}
              value={shippingData.city}
              onChange={(e) => handleShippingChange("city", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.shipping?.city && (
              <p className="text-red-500 text-sm">
                {errors.shipping.city.message}
              </p>
            )}
            <input
              type="text"
              placeholder="Código Postal"
              {...register("shipping.postalCode", {
                required: "Campo obligatorio",
              })}
              value={shippingData.postalCode}
              onChange={(e) =>
                handleShippingChange("postalCode", e.target.value)
              }
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.shipping?.postalCode && (
              <p className="text-red-500 text-sm">
                {errors.shipping.postalCode.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-300">
            Datos de Pago
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Número de Tarjeta"
              value={creditCardData.cardNumber}
              {...register("card.cardNumber", {
                required: "Campo obligatorio",
                validate: (v) =>
                  v.replace(/\s/g, "").length === 16 || "Debe tener 16 dígitos",
              })}
              onChange={(e) =>
                handlePaymentChange("cardNumber", e.target.value)
              }
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              maxLength={16}
            />
            {errors.card?.cardNumber && (
              <p className="text-red-500 text-sm">
                {errors.card.cardNumber.message}
              </p>
            )}
            <input
              type="text"
              placeholder="Titular de la Tarjeta"
              {...register("card.cardHolder", {
                required: "Campo obligatorio",
              })}
              value={creditCardData.cardHolder}
              onChange={(e) =>
                handlePaymentChange("cardHolder", e.target.value)
              }
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.card?.cardHolder && (
              <p className="text-red-500 text-sm">
                {errors.card.cardHolder.message}
              </p>
            )}
            <input
              type="text"
              placeholder="MM/AA"
              {...register("card.expiryDate", {
                required: "Campo obligatorio",
                validate: (v) =>
                  /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) ||
                  "Formato inválido (MM/AA)",
              })}
              value={creditCardData.expiryDate}
              onChange={(e) =>
                handlePaymentChange("expiryDate", e.target.value)
              }
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              maxLength={5}
            />
            {errors.card?.expiryDate && (
              <p className="text-red-500 text-sm">
                {errors.card.expiryDate.message}
              </p>
            )}
            <input
              type="text"
              placeholder="CVV"
              {...register("card.cvv", {
                required: "Campo obligatorio",
                validate: (v) =>
                  (v.trim().length >= 3 && v.trim().length <= 4) ||
                  "CVV inválido",
              })}
              value={creditCardData.cvv}
              onChange={(e) => handlePaymentChange("cvv", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              maxLength={4}
            />
            {errors.card?.cvv && (
              <p className="text-red-500 text-sm">{errors.card.cvv.message}</p>
            )}
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
            data-testid="submit-button"
          >
            Continuar al Resumen
          </button>
        </div>
      </form>
    </div>
  );
};
