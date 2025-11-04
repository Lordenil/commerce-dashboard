import { describe, it, expect, beforeEach, vi } from "vitest";
import themeReducer, {
  toggleTheme,
  initializeTheme,
} from "../../src/store/themeSlice";

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
  });

  const classListMock = {
    toggle: vi.fn(),
  };

  vi.stubGlobal("document", {
    documentElement: { classList: classListMock },
  });
});

describe("themeSlice", () => {
  it("should return the initial state (light theme by default)", () => {
    const initialState = { darkMode: false };
    const state = themeReducer(undefined, { type: "@@INIT" });
    expect(state).toEqual(initialState);
  });

  it("should toggle theme from light to dark", () => {
    const initialState = { darkMode: false };

    const state = themeReducer(initialState, toggleTheme());

    expect(state.darkMode).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith(
      "dark",
      true
    );
  });

  it("should toggle theme from dark to light", () => {
    const initialState = { darkMode: true };

    const state = themeReducer(initialState, toggleTheme());

    expect(state.darkMode).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith(
      "dark",
      false
    );
  });

  it("should initialize theme with current darkMode value", () => {
    const initialState = { darkMode: true };

    themeReducer(initialState, initializeTheme());

    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith(
      "dark",
      true
    );
  });
});
