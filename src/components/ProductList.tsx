import { usePayment, useProduct } from "../common";
import type { Product } from "../models/Product";
import { PaymentModal } from "./PaymentModal";

export const ProductList = () => {
  const { products, loading, error } = useProduct();
  const {
    isPaymentModalOpen,
    selectedProduct,
    openPaymentModal,
    closePaymentModal,
  } = usePayment();

  const handleBuyProduct = (product: any) => {
    openPaymentModal(product);
  };

  if (loading)
    return <div className="text-center py-8">Cargando productos...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <>
      {products.map((product: Product) => (
        <div
          key={product.id}
          className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition flex flex-col"
        >
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div>
            <div className="font-medium dark:text-white">{product.name}</div>
            <p className=" dark:text-white">
              descripcion del producto: {product.name}
            </p>
            <p className="text-sm dark:text-white text-gray-500">
              Cantidad: {product.stock}
            </p>
          </div>
          <div className="mt-auto">
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={() => handleBuyProduct(product)}
            >
              Comprar con Tarjeta de Credito
            </button>
          </div>
        </div>
      ))}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        product={selectedProduct}
      />
    </>
  );
};
