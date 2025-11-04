import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProductsPage } from "../../src/pages/ProductsPage";

vi.mock("../../src/components/ProductList", () => ({
  ProductList: () => <div data-testid="product-list">Mocked ProductList</div>,
}));

describe("ProductsPage", () => {
  it("renders the title and the ProductList", () => {
    render(<ProductsPage />);

    expect(
      screen.getByRole("heading", { name: /Productos/i })
    ).toBeInTheDocument();

    expect(screen.getByTestId("product-list")).toBeInTheDocument();
  });
});
