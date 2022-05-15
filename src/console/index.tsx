import React from 'react'
import ReactDOM from 'react-dom/client'
import { add } from "../lib/calc";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <p>{ 'hello' + add(10, 20) }</p>
  </React.StrictMode>
)

