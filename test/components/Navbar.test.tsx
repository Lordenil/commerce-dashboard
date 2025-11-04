import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../../src/components/Navbar";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../../src/store/themeSlice";

const renderWithStore = (initialState = { theme: { darkMode: false } }) => {
  const store = configureStore({
    reducer: { theme: themeReducer },
    preloadedState: initialState,
  });

  return render(
    <Provider store={store}>
      <Navbar />
    </Provider>
  );
};

describe("Navbar component", () => {
  it("renders logo and title correctly", () => {
    renderWithStore();

    const logo = screen.getByAltText(/Wompi Logo/i);
    expect(logo).toBeInTheDocument();

    expect(screen.getByText(/Commerce App/i)).toBeInTheDocument();
  });

  it("shows Moon icon when dark mode is off", () => {
    renderWithStore({ theme: { darkMode: false } });
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
  });

  it("shows Sun icon when dark mode is on", () => {
    renderWithStore({ theme: { darkMode: true } });
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
  });

  it("dispatches toggleTheme when button is clicked", () => {
    const store = configureStore({
      reducer: { theme: themeReducer },
      preloadedState: { theme: { darkMode: false } },
    });

    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const state = store.getState().theme;
    expect(state.darkMode).toBe(true);
  });
});
