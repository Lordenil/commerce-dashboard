import { describe, it, expect, vi, beforeEach } from "vitest";
import productReducer, {
  clearProducts,
  setProducts,
  fetchProducts,
} from "../../../src/store/slices/productSlice";
import { ProductService } from "../../../src/services/productService";
import type { Product } from "../../../src/models/Product";

vi.mock("../../../src/services/productService", () => ({
  ProductService: {
    getProducts: vi.fn(),
  },
}));

describe("productSlice", () => {
  const initialState = {
    products: [],
    loading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the initial state", () => {
    const state = productReducer(undefined, { type: "@@INIT" });
    expect(state).toEqual(initialState);
  });

  it("should clear products when clearProducts is dispatched", () => {
    const prevState = {
      ...initialState,
      products: [{ id: "1", name: "Test", price: 100 }] as Product[],
    };
    const state = productReducer(prevState, clearProducts());
    expect(state.products).toEqual([]);
  });

  it("should set products when setProducts is dispatched", () => {
    const newProducts = [{ id: "1", name: "Test", price: 100 }] as Product[];
    const state = productReducer(initialState, setProducts(newProducts));
    expect(state.products).toEqual(newProducts);
  });

  it("should handle fetchProducts.pending", () => {
    const action = { type: fetchProducts.pending.type };
    const state = productReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("should handle fetchProducts.fulfilled", () => {
    const products = [{ id: "1", name: "P1", price: 123 }] as Product[];
    const action = { type: fetchProducts.fulfilled.type, payload: products };
    const state = productReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.products).toEqual(products);
  });

  it("should handle fetchProducts.rejected", () => {
    const action = {
      type: fetchProducts.rejected.type,
      payload: "Error de red",
    };
    const state = productReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error de red");
  });

  it("should dispatch fulfilled when ProductService resolves", async () => {
    const mockProducts = [{ id: "1", name: "P1", price: 123 }] as Product[];
    (ProductService.getProducts as any).mockResolvedValue(mockProducts);

    const dispatch = vi.fn();
    const thunk = fetchProducts();
    const getState = vi.fn();

    await thunk(dispatch, getState, undefined);

    expect(ProductService.getProducts).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: fetchProducts.pending.type })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: fetchProducts.fulfilled.type,
        payload: mockProducts,
      })
    );
  });

  it("should dispatch rejected when ProductService throws", async () => {
    (ProductService.getProducts as any).mockRejectedValue(
      new Error("Network error")
    );

    const dispatch = vi.fn();
    const thunk = fetchProducts();
    const getState = vi.fn();

    await thunk(dispatch, getState, undefined);

    expect(ProductService.getProducts).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: fetchProducts.pending.type })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: fetchProducts.rejected.type,
        payload: "Network error",
      })
    );
  });
});
