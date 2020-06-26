import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, CSSReset, theme as chakraTheme } from "@chakra-ui/core";
import "@reach/tooltip/styles.css";
import { Accounts } from "./pages/Accounts";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={chakraTheme}>
      <CSSReset />
      <Accounts />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
