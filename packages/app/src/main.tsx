import "@fontsource/inter/variable.css";
import "@fontsource/raleway/variable.css";

import "./styles/index.css";

// import { inspect } from "@xstate/inspect";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";

// inspect({
//   iframe: false,
// });

const { PUBLIC_URL } = process.env;
createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={PUBLIC_URL}>
    <App />
  </BrowserRouter>
);
