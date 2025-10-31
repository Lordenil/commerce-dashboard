import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { Sun, Moon } from "lucide-react";
import { toggleTheme } from "../store/themeSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 dark:bg-gray-800 shadow-md">
      <h1 className="text-xl font-bold dark:text-white">🛍️ Commerce App</h1>

      <button
        onClick={() => dispatch(toggleTheme())}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  );
}
