import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState = {
  darkMode: localStorage.getItem("theme") === "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      const theme = state.darkMode ? "dark" : "light";
      document.documentElement.classList.toggle("dark", state.darkMode);
      localStorage.setItem("theme", theme);
    },
    initializeTheme: (state) => {
      document.documentElement.classList.toggle("dark", state.darkMode);
    },
  },
});

export const { toggleTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
