import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PaymentModal } from "../../src/components/PaymentModal"; // Ajusta la ruta
import { usePayment } from "../../src/common";
import { Product } from "../../src/models/Product";

vi.mock("../../src/common", () => ({
  usePayment: vi.fn(),
}));

vi.mock("../../src/components/PaymentForm", () => ({
  PaymentForm: ({ onClose, product }: any) => (
    <div>
      <p>Mock PaymentForm</p>
      <p>{product.name}</p>
      <button onClick={onClose}>Cerrar Formulario</button>
    </div>
  ),
}));

vi.mock("../../src/components/PaymentSumary", () => ({
  PaymentSummary: () => <p>Mock PaymentSummary</p>,
}));

vi.mock("../../src/components/PaymentStatus", () => ({
  PaymentStatus: () => <p>Mock PaymentStatus</p>,
}));

describe("PaymentModal Component", () => {
  const mockOnClose = vi.fn();
  const mockClosePaymentModal = vi.fn();
  const mockSavePaymentData = vi.fn();
  const mockProduct: Product = {
    id: "1",
    name: "Producto Test",
    price: 120,
    sku: "001",
    currency: "USD",
    stock: 10,
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no debería renderizarse si isOpen es false", () => {
    (usePayment as any).mockReturnValue({
      currentStep: "payment",
      closePaymentModal: mockClosePaymentModal,
      savePaymentData: mockSavePaymentData,
    });

    const { container } = render(
      <PaymentModal
        isOpen={false}
        onClose={mockOnClose}
        product={mockProduct}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("debería renderizar el título y el botón de cierre", () => {
    (usePayment as any).mockReturnValue({
      currentStep: "payment",
      closePaymentModal: mockClosePaymentModal,
      savePaymentData: mockSavePaymentData,
    });

    render(
      <PaymentModal isOpen={true} onClose={mockOnClose} product={mockProduct} />
    );

    expect(screen.getByText(/Completar Compra/i)).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "×" });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("debería mostrar PaymentForm cuando currentStep es 'payment'", () => {
    (usePayment as any).mockReturnValue({
      currentStep: "payment",
      closePaymentModal: mockClosePaymentModal,
      savePaymentData: mockSavePaymentData,
    });

    render(
      <PaymentModal isOpen={true} onClose={mockOnClose} product={mockProduct} />
    );

    expect(screen.getByText("Mock PaymentForm")).toBeInTheDocument();
    expect(screen.getByText("Producto Test")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cerrar Formulario"));
    expect(mockClosePaymentModal).toHaveBeenCalledTimes(1);
  });

  it("debería mostrar PaymentSummary cuando currentStep es 'summary'", () => {
    (usePayment as any).mockReturnValue({
      currentStep: "summary",
      closePaymentModal: mockClosePaymentModal,
      savePaymentData: mockSavePaymentData,
    });

    render(
      <PaymentModal isOpen={true} onClose={mockOnClose} product={mockProduct} />
    );

    expect(screen.getByText("Mock PaymentSummary")).toBeInTheDocument();
  });

  it("debería mostrar PaymentStatus cuando currentStep es 'status'", () => {
    (usePayment as any).mockReturnValue({
      currentStep: "status",
      closePaymentModal: mockClosePaymentModal,
      savePaymentData: mockSavePaymentData,
    });

    render(
      <PaymentModal isOpen={true} onClose={mockOnClose} product={mockProduct} />
    );

    expect(screen.getByText("Mock PaymentStatus")).toBeInTheDocument();
  });
});
