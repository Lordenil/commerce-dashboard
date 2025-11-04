import { render, screen, fireEvent } from "@testing-library/react";
import { ProductList } from "../../src/components/ProductList";
import { useProduct, usePayment } from "../../src/common";
import { vi } from "vitest";

vi.mock("../../src/common", () => ({
  useProduct: vi.fn(),
  usePayment: vi.fn(),
}));

vi.mock("../../src/components/PaymentModal", () => ({
  PaymentModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="payment-modal">Modal Abierto</div> : null,
}));

describe("ProductList Component", () => {
  const mockProducts = [
    { id: "1", name: "Producto 1", stock: 5, price: 100 },
    { id: "2", name: "Producto 2", stock: 10, price: 200 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el estado de carga", () => {
    (useProduct as jest.Mock).mockReturnValue({
      products: [],
      loading: true,
      error: null,
    });
    (usePayment as jest.Mock).mockReturnValue({
      isPaymentModalOpen: false,
    });

    render(<ProductList />);

    expect(screen.getByText("Cargando productos...")).toBeInTheDocument();
  });

  it("muestra un error si useProduct devuelve error", () => {
    (useProduct as jest.Mock).mockReturnValue({
      products: [],
      loading: false,
      error: "Error al cargar productos",
    });
    (usePayment as jest.Mock).mockReturnValue({
      isPaymentModalOpen: false,
    });

    render(<ProductList />);

    expect(
      screen.getByText(/Error: Error al cargar productos/i)
    ).toBeInTheDocument();
  });

  it("renderiza la lista de productos correctamente", () => {
    (useProduct as jest.Mock).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });
    (usePayment as jest.Mock).mockReturnValue({
      isPaymentModalOpen: false,
      selectedProduct: null,
      openPaymentModal: vi.fn(),
      closePaymentModal: vi.fn(),
    });

    render(<ProductList />);

    expect(screen.getByText("Producto 1")).toBeInTheDocument();
    expect(screen.getByText("Producto 2")).toBeInTheDocument();
    expect(screen.getAllByText(/Comprar con Tarjeta de Credito/i)).toHaveLength(
      2
    );
  });

  it("llama a openPaymentModal cuando se hace clic en Comprar", () => {
    const mockOpenPaymentModal = vi.fn();

    (useProduct as jest.Mock).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });
    (usePayment as jest.Mock).mockReturnValue({
      isPaymentModalOpen: false,
      selectedProduct: null,
      openPaymentModal: mockOpenPaymentModal,
      closePaymentModal: vi.fn(),
    });

    render(<ProductList />);

    const buyButtons = screen.getAllByText(/Comprar con Tarjeta de Credito/i);
    fireEvent.click(buyButtons[0]);

    expect(mockOpenPaymentModal).toHaveBeenCalledWith(mockProducts[0]);
  });

  it("muestra el modal de pago cuando isPaymentModalOpen es true", () => {
    (useProduct as jest.Mock).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });
    (usePayment as jest.Mock).mockReturnValue({
      isPaymentModalOpen: true,
      selectedProduct: mockProducts[0],
      openPaymentModal: vi.fn(),
      closePaymentModal: vi.fn(),
    });

    render(<ProductList />);

    expect(screen.getByTestId("payment-modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Abierto")).toBeInTheDocument();
  });
});
