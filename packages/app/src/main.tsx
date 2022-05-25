import "@fontsource/fira-code";
import "@fontsource/inter/variable.css";
import "./styles/index.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const { PUBLIC_URL } = process.env;
createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={PUBLIC_URL}>
    <App />
  </BrowserRouter>
);
