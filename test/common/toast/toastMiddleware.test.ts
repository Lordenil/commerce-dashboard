import { describe, it, expect, vi } from "vitest";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { toastMiddleware } from "../../../src/common/toast/toastMiddleware";

vi.mock("@reduxjs/toolkit", () => ({
  isRejectedWithValue: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("toastMiddleware", () => {
  const next = vi.fn();
  const invoke = (action: any) => toastMiddleware()(next)(action);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe mostrar un toast cuando la acción es rechazada con valor", () => {
    (isRejectedWithValue as vi.Mock).mockReturnValue(true);

    const action = { type: "someAction/rejected", payload: "Error test" };
    invoke(action);

    expect(isRejectedWithValue).toHaveBeenCalledWith(action);
    expect(toast.error).toHaveBeenCalledWith("Error test", {
      position: "top-right",
      autoClose: 3000,
    });
    expect(next).toHaveBeenCalledWith(action);
  });

  it("debe mostrar mensaje por defecto si no hay payload", () => {
    (isRejectedWithValue as vi.Mock).mockReturnValue(true);

    const action = { type: "someAction/rejected" };
    invoke(action);

    expect(toast.error).toHaveBeenCalledWith("Ocurrió un error inesperado.", {
      position: "top-right",
      autoClose: 3000,
    });
  });

  it("no debe mostrar toast si la acción no fue rechazada", () => {
    (isRejectedWithValue as vi.Mock).mockReturnValue(false);

    const action = { type: "someAction/fulfilled", payload: "OK" };
    invoke(action);

    expect(toast.error).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });
});
