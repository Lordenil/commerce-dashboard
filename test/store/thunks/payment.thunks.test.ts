import { vi, describe, it, expect } from "vitest";
import { savePaymentDataWithCustomerThunk } from "../../../src/store/thunks/payment.thunks";
import { createCustomerThunk } from "../../../src/store/thunks/customer.thunks";

vi.mock("../../../src/store/thunks/customer.thunks", () => ({
  createCustomerThunk: vi.fn(),
}));

describe("savePaymentDataWithCustomerThunk", () => {
  const mockGetState = vi.fn();

  const mockShipping = {
    fullName: "Juan Pérez",
    email: "juan@example.com",
    address: "Calle 123",
    city: "Bogotá",
    postalCode: "110111",
    country: "Colombia",
    phone: "3001234567",
  };

  const mockPayment = {
    cardNumber: "4111111111111111",
    expirationDate: "12/25",
    cvv: "123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería retornar datos combinados cuando la creación del cliente es exitosa", async () => {
    const mockCustomer = { id: "cust_123", name: "Juan Pérez" };

    (createCustomerThunk as any).mockReturnValue("fake-thunk");

    const mockDispatch = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockResolvedValue(mockCustomer),
    });

    const thunk = savePaymentDataWithCustomerThunk({
      shipping: mockShipping,
      payment: mockPayment,
    });

    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(createCustomerThunk).toHaveBeenCalledWith({
      shippingData: mockShipping,
    });

    expect(result.meta.arg.shipping.fullName).toEqual("Juan Pérez");
  });
});
