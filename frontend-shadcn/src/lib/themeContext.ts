import { createContext } from "react";

export type Theme = "light" | "dark";

// Where the visitor's choice is remembered. The script in index.html reads the same key.
export const THEME_KEY = "andalusia.theme";

export type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

// Filled in by ThemeProvider, read with the useTheme hook
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);
