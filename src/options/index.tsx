import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./global.css";

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("vimmatic-settings");
  ReactDOM.render(<App />, wrapper);
});
