import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Buffer } from "buffer";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Toaster />
      <App />
    </StrictMode>
  </BrowserRouter>
);
