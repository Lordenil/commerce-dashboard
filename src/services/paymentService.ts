import { http } from "../common";
import type { Product } from "../models/Product";

const getProducts = async () => {
  const response = await http.get<Product[]>("/products");
  return response.data;
};

export const ProductService = {
  getProducts,
};
