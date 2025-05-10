import React from "react";
import ReactDOM from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { StyledEngineProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const cache = createCache({
  key: "css",
  prepend: true,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <StyledEngineProvider injectFirst>
        <App />
      </StyledEngineProvider>
    </CacheProvider>
  </React.StrictMode>
);