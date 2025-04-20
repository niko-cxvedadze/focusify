import "./assets/index.css";
import { createRoot } from "react-dom/client";
import { Providers } from "./providers/Providers";

import App from "./App";

createRoot(document.getElementById("app")!).render(
  <Providers>
    <App />
  </Providers>,
);
