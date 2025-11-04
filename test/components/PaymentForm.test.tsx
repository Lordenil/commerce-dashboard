import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PaymentForm } from "../../src/components/PaymentForm";
import { Product } from "../../src/models/Product";

describe("PaymentForm Component", () => {
  const mockProduct: Product = {
    id: "1",
    name: "Producto Test",
    price: 120,
    sku: "001",
    currency: "USD",
    stock: 10,
    createdAt: new Date(),
  };
  const mockOnClose = vi.fn();
  const mockOnSavePaymentData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar la información del producto correctamente", () => {
    render(
      <PaymentForm
        onClose={mockOnClose}
        product={mockProduct}
        onSavePaymentData={mockOnSavePaymentData}
      />
    );

    expect(screen.getByText(/Producto Test/i)).toBeInTheDocument();
    expect(screen.getByText(/\$120/i)).toBeInTheDocument();
  });

  it("debería permitir escribir en los campos del formulario", () => {
    render(
      <PaymentForm
        onClose={mockOnClose}
        product={mockProduct}
        onSavePaymentData={mockOnSavePaymentData}
      />
    );

    const fullNameInput = screen.getByPlaceholderText("Nombre completo");
    fireEvent.change(fullNameInput, { target: { value: "Juan Pérez" } });
    expect(fullNameInput).toHaveValue("Juan Pérez");

    const cardInput = screen.getByPlaceholderText("Número de Tarjeta");
    fireEvent.change(cardInput, { target: { value: "4111111111111111" } });
    expect(cardInput).toHaveValue("4111111111111111");
  });

  it("debería llamar a onSavePaymentData con los datos correctos al enviar", () => {
    render(
      <PaymentForm
        onClose={mockOnClose}
        product={mockProduct}
        onSavePaymentData={mockOnSavePaymentData}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Nombre completo"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByPlaceholderText("Teléfono"), {
      target: { value: "3001234567" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Dirección"), {
      target: { value: "Calle 123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ciudad"), {
      target: { value: "Bogotá" },
    });
    fireEvent.change(screen.getByPlaceholderText("Código Postal"), {
      target: { value: "110111" },
    });
    fireEvent.change(screen.getByPlaceholderText("País"), {
      target: { value: "Colombia" },
    });

    fireEvent.change(screen.getByPlaceholderText("Número de Tarjeta"), {
      target: { value: "4111111111111111" },
    });
    fireEvent.change(screen.getByPlaceholderText("Titular de la Tarjeta"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByPlaceholderText("MM/AA"), {
      target: { value: "12/25" },
    });
    fireEvent.change(screen.getByPlaceholderText("CVV"), {
      target: { value: "123" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: /Continuar al Resumen/i })
    );

    expect(mockOnSavePaymentData).toHaveBeenCalledTimes(1);
    const [shipping, payment] = mockOnSavePaymentData.mock.calls[0];

    expect(shipping.fullName).toBe("Juan Pérez");
    expect(payment.cardNumber).toBe("4111111111111111");
  });

  it("debería llamar a onClose al presionar Cancelar", () => {
    render(
      <PaymentForm
        onClose={mockOnClose}
        product={mockProduct}
        onSavePaymentData={mockOnSavePaymentData}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
