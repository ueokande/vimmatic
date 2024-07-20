import React from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./app/provider";
import { App } from "./App";

window.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("vimmatic-console");
  if (!wrapper) {
    throw new Error("No wrapper element found");
  }
  const root = createRoot(wrapper);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>,
  );
});
