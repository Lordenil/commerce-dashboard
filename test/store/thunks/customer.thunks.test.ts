import { vi, describe, it, expect } from "vitest";
import { createCustomerThunk } from "../../../src/store/thunks";
import { CustomerService } from "../../../src/services/customerService";

vi.mock("../../../src/services/customerService", () => ({
  CustomerService: {
    createCustomer: vi.fn(),
  },
}));

describe("createCustomerThunk", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();

  const shippingData = {
    fullName: "Juan Pérez",
    email: "juan@example.com",
    address: "Calle 123",
    city: "Bogotá",
    postalCode: "110111",
    country: "Colombia",
    phone: "3001234567",
  };

  it("debería retornar el cliente cuando la creación es exitosa", async () => {
    const mockCustomer = { id: "cust_123", name: "Juan Pérez" };
    (CustomerService.createCustomer as any).mockResolvedValueOnce(mockCustomer);

    const thunk = createCustomerThunk({ shippingData });
    const result = await thunk(mockDispatch, mockGetState, {});

    expect(CustomerService.createCustomer).toHaveBeenCalledWith({
      name: "Juan Pérez",
      email: "juan@example.com",
    });

    expect(result.payload).toEqual(mockCustomer);
    expect(result.type).toBe("customer/createCustomer/fulfilled");
  });

  it("debería retornar un error cuando la creación falla", async () => {
    const mockError = { response: { data: "Error en la API" } };
    (CustomerService.createCustomer as any).mockRejectedValueOnce(mockError);

    const thunk = createCustomerThunk({ shippingData });
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(CustomerService.createCustomer).toHaveBeenCalledWith({
      name: "Juan Pérez",
      email: "juan@example.com",
    });

    expect(result.payload).toBe("Error en la API");
    expect(result.type).toBe("customer/createCustomer/rejected");
  });

  it("debería retornar 'Error creating customer' si no hay response en el error", async () => {
    (CustomerService.createCustomer as any).mockRejectedValueOnce(
      new Error("Error desconocido")
    );

    const thunk = createCustomerThunk({ shippingData });
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(CustomerService.createCustomer).toHaveBeenCalledWith({
      name: "Juan Pérez",
      email: "juan@example.com",
    });

    expect(result.payload).toBe("Error creating customer");
    expect(result.type).toBe("customer/createCustomer/rejected");
  });
});
