import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { THEME_KEY, ThemeContext, type Theme } from "@/lib/themeContext";

// The script in index.html has already picked the theme (saved choice, else the system setting)
// and set the class before the first paint, so start from that to avoid a flash
function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// Light / dark mode: the "dark" class on <html> switches the colour tokens in index.css
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    // Native scrollbars and form controls follow the theme too
    root.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked (e.g. private mode): the switch still works for this visit
    }
    setTheme(next);
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
