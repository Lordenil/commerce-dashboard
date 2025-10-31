import { ProductList } from "../components/ProductList";

export const ProductsPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Productos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductList />
      </div>
    </div>
  );
};
