import { createRoot } from "react-dom/client";
import "@fraserelliott/fe-utilities/fe-utilities.css";
import "@fraserelliott/fe-slate";
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "@fraserelliott/fe-components";
import { ApiProvider } from "./contexts/ApiContext";
import { IdeasProvider } from "./contexts/IdeasContext";

createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <ApiProvider>
      <IdeasProvider>
        <App />
      </IdeasProvider>
    </ApiProvider>
  </ToastProvider>
);
