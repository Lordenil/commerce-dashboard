import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ProductsPage } from "./pages/ProductsPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <div className="min-h-screen  bg-gray-200 dark:bg-gray-700 transition-colors duration-300">
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
        <ToastContainer />
      </QueryClientProvider>
    </div>
  );
}
