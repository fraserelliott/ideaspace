import { createRoot } from "react-dom/client";
import "@fraserelliott/fe-utilities/fe-utilities.css";
import "@fraserelliott/fe-slate";
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "@fraserelliott/fe-components";
import { ApiProvider } from "./contexts/ApiContext";
import { AuthProvider } from "./contexts/AuthContext";
import { IdeasProvider } from "./contexts/IdeasContext";

createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <ApiProvider>
      <AuthProvider>
        <IdeasProvider>
          <App />
        </IdeasProvider>
      </AuthProvider>
    </ApiProvider>
  </ToastProvider>
);
