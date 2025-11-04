import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PaymentStatus } from "../../src/components/PaymentStatus";
import { usePayment } from "../../src/common";

vi.mock("../../src/common", () => ({
  usePayment: vi.fn(),
}));

describe("PaymentStatus Component", () => {
  const mockClosePaymentModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar el mensaje de pago exitoso", () => {
    (usePayment as any).mockReturnValue({
      currentTransaction: null,
      closePaymentModal: mockClosePaymentModal,
    });

    render(<PaymentStatus />);

    expect(screen.getByText(/¡Pago Exitoso!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Tu pedido ha sido procesado correctamente/i)
    ).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /Cerrar/i });
    fireEvent.click(closeButton);

    expect(mockClosePaymentModal).toHaveBeenCalledTimes(1);
  });

  it("debería mostrar los detalles de la transacción cuando existen", () => {
    (usePayment as any).mockReturnValue({
      currentTransaction: {
        id: "TX12345",
        productName: "Camiseta Premium",
        amount: 150,
      },
      closePaymentModal: mockClosePaymentModal,
    });

    render(<PaymentStatus />);

    expect(screen.getByText(/Detalles de la Transacción/i)).toBeInTheDocument();
    expect(screen.getByText(/TX12345/i)).toBeInTheDocument();
    expect(screen.getByText(/Camiseta Premium/i)).toBeInTheDocument();
    expect(screen.getByText(/\$150/i)).toBeInTheDocument();
  });
});
