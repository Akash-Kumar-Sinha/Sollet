import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Buffer } from "buffer";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);
