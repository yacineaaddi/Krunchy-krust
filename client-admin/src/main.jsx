//Imports
import AppProvider from "./context/AppProvider.jsx";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

//Create React root
createRoot(document.getElementById("root")).render(
  <AppProvider>
    <App />,
  </AppProvider>,
);
