import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, CSSReset, theme as chakraTheme } from "@chakra-ui/core";
import "@reach/tooltip/styles.css";
import { Home } from "./pages/Home";
import { AppConfigProvider } from "./context/AppConfigContext";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={chakraTheme}>
      <CSSReset />
      <AppConfigProvider>
        <Home />
      </AppConfigProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
