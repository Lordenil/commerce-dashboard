import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useProduct } from "../../../src/common/hooks/useProduct";

vi.mock("../../../src/store/slices/productSlice", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    fetchProducts: vi.fn(() => ({ type: "product/fetchProducts" })),
    default: actual.default,
  };
});

import productReducer, {
  fetchProducts,
} from "../../../src/store/slices/productSlice";

describe("useProduct hook", () => {
  it("should dispatch fetchProducts on mount", () => {
    const store = configureStore({
      reducer: { product: productReducer },
      preloadedState: {
        product: { products: [], loading: false, error: null },
      },
    });

    renderHook(() => useProduct(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(fetchProducts).toHaveBeenCalled();
  });

  it("should expose products, loading and error from store", () => {
    const store = configureStore({
      reducer: { product: productReducer },
      preloadedState: {
        product: {
          products: [{ id: 1, name: "Producto 1", stock: 10 }],
          loading: false,
          error: null,
        },
      },
    });

    const { result } = renderHook(() => useProduct(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
