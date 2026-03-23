import AppProvider from "./context/AppProvider.jsx";
import { createRoot } from "react-dom/client";
import ReactApp from "./ReactApp.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <ReactApp />
  </AppProvider>,
);
