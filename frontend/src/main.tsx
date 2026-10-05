import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material";
import App from "./App";

const theme = createTheme({
  palette: {
    primary: { main: "#cee1ed", contrastText: "#0e0b0b" },
    secondary: { main: "#113348", contrastText: "#FFFFFF" },
    background: { default: "#FAF1EA", paper: "#FFFFFF" },
    text: { primary: "#211E1C", secondary: "#6B615C" },
  },
  shape: {
    borderRadius: 8,
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
