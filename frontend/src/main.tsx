import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material";
import App from "./App";

const theme = createTheme({
  palette: {
    primary: { main: "#e9b682", contrastText: "#0e0b0b" },
    secondary: { main: "#422e1b", contrastText: "#FFFFFF" },
    background: { default: "#FAF1EA", paper: "#FFFFFF" },
    text: { primary: "#211E1C", secondary: "#6B615C" },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
