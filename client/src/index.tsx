import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { WalletProvider } from "src/context/WalletContext";

const { PUBLIC_URL } = process.env;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={PUBLIC_URL}>
      <WalletProvider>
        <App />
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
