import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./global.css";

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("vimmatic-settings");
  if (!wrapper) {
    throw new Error("Could not find wrapper element");
  }
  const root = createRoot(wrapper);
  root.render(<App />);
});
