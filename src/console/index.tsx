import React from "react";
import ReactDOM from "react-dom";
import ColorSchemeProvider from "./styles/providers";
import { AppProvider } from "./app/provider";
import App from "./App";

window.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("vimmatic-console");
  ReactDOM.render(
    <React.StrictMode>
      <AppProvider>
        <ColorSchemeProvider>
          <App />
        </ColorSchemeProvider>
      </AppProvider>
    </React.StrictMode>,
    wrapper
  );
});
