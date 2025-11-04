import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { usePayment } from "../../src/common";
import { PaymentSummary } from "../../src/components/PaymentSumary";

vi.mock("../../src/common", () => ({
  usePayment: vi.fn(),
}));

describe("PaymentSummary Component", () => {
  const mockConfirmPayment = vi.fn();
  const mockBackToPayment = vi.fn();

  const mockData = {
    selectedProduct: {
      name: "Laptop Gamer",
      description: "Potente laptop con GPU RTX",
      price: 2500,
    },
    shippingData: {
      fullName: "Carlos Pérez",
      address: "Calle 123",
      city: "Bogotá",
      postalCode: "110111",
      country: "Colombia",
      phone: "3101234567",
    },
    creditCardData: {
      cardNumber: "1234567812345678",
      cardHolder: "Carlos Pérez",
    },
    isProcessing: false,
    confirmPayment: mockConfirmPayment,
    backToPayment: mockBackToPayment,
  };

  it("debe mostrar mensaje de error si faltan datos", () => {
    (usePayment as any).mockReturnValue({
      selectedProduct: null,
      shippingData: null,
      creditCardData: null,
    });

    render(<PaymentSummary />);
    expect(screen.getByText(/Datos incompletos/i)).toBeInTheDocument();
  });

  it("debe renderizar la información completa correctamente", () => {
    (usePayment as any).mockReturnValue(mockData);

    render(<PaymentSummary />);

    expect(screen.getByText("Resumen de Compra")).toBeInTheDocument();
    expect(screen.getByText("Laptop Gamer")).toBeInTheDocument();
    expect(screen.getByText("Potente laptop con GPU RTX")).toBeInTheDocument();
    expect(screen.getByText("Carlos Pérez")).toBeInTheDocument();
    expect(screen.getByText("Tarjeta de Crédito")).toBeInTheDocument();
    expect(screen.getByText(/Titular: Carlos Pérez/)).toBeInTheDocument();
  });

  it("debe ejecutar backToPayment al presionar 'Volver'", () => {
    (usePayment as any).mockReturnValue(mockData);

    render(<PaymentSummary />);
    const volverButton = screen.getByRole("button", { name: /Volver/i });
    fireEvent.click(volverButton);

    expect(mockBackToPayment).toHaveBeenCalledTimes(1);
  });

  it("debe ejecutar confirmPayment al presionar 'Confirmar y Pagar'", () => {
    (usePayment as any).mockReturnValue(mockData);

    render(<PaymentSummary />);
    const confirmButton = screen.getByRole("button", {
      name: /Confirmar y Pagar/i,
    });
    fireEvent.click(confirmButton);

    expect(mockConfirmPayment).toHaveBeenCalledTimes(1);
  });

  it("debe mostrar el estado 'Procesando...' cuando isProcessing = true", () => {
    (usePayment as any).mockReturnValue({
      ...mockData,
      isProcessing: true,
    });

    render(<PaymentSummary />);

    expect(screen.getByText(/Procesando.../i)).toBeInTheDocument();
  });
});
