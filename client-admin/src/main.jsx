import { BrowserRouter, Routes } from "react-router-dom";
import AppProvider from "./context/AppProvider.jsx";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <Toaster position="top-center" reverseOrder={false} />
    <BrowserRouter>
      <Routes>
        <App />
      </Routes>
    </BrowserRouter>
  </AppProvider>,
);
