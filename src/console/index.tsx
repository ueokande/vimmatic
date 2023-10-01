import React from "react";
import { createRoot } from "react-dom/client";
import ColorSchemeProvider from "./styles/providers";
import { AppProvider } from "./app/provider";
import App from "./App";

window.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("vimmatic-console");
  if (!wrapper) {
    throw new Error("No wrapper element found");
  }
  const root = createRoot(wrapper);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <ColorSchemeProvider>
          <App />
        </ColorSchemeProvider>
      </AppProvider>
    </React.StrictMode>,
  );
});
