import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useCallback, useEffect } from "react";
import { fetchProducts } from "../../store/slices/productSlice";

export const useProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const refetchProducts = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return {
    products,
    loading,
    error,
    refetchProducts,
  };
};
