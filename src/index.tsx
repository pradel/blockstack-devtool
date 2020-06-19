import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "theme-ui";
import "@reach/tooltip/styles.css";
import "@reach/dialog/styles.css";
import { theme } from "./theme";
import { Accounts } from "./pages/Accounts";

console.log(theme);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Accounts />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
