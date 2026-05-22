import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { caES } from "@mui/material/locale";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { App } from "./App.tsx";

// TODO only import and attach to window on test builds
import { showTourMessage } from "./utils/test-utils.ts";

const theme = createTheme({}, caES);

declare global {
  interface Window {
    showTourMessage: any;
  }
}

window.showTourMessage = showTourMessage;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
