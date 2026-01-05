import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { caES } from "@mui/material/locale";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { App } from "./App.tsx";

const theme = createTheme({}, caES);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
