import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, CSSReset, theme as chakraTheme } from "@chakra-ui/core";
import "@reach/tooltip/styles.css";
import { Home } from "./pages/Home";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={chakraTheme}>
      <CSSReset />
      <Home />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
