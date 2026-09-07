"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Tema claro/oscuro.
 *
 * La identidad del estudio es clara, así que el claro es el default. El oscuro
 * es una preferencia que la persona elige y que se recuerda en `localStorage`.
 *
 * El primer pintado ya sale con el tema correcto gracias al script de
 * `ThemeScript`, que corre antes de que React hidrate.
 */

export type Theme = "light" | "dark";

const STORAGE_KEY = "md-theme";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  /*
   * El estado inicial se lee del DOM, no de localStorage con un efecto.
   *
   * `ThemeScript` ya puso la clase `dark` en el <html> antes de que React
   * arranque, así que la respuesta correcta está a mano: leerla acá evita un
   * render extra y el parpadeo de claro a oscuro. La función se ejecuta una
   * sola vez, y en el servidor (donde no hay `document`) devuelve "light",
   * que es lo que el HTML del servidor ya trae.
   */
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme necesita estar dentro de <ThemeProvider>");
  return context;
}

/**
 * Aplica el tema guardado antes del primer pintado, para que nadie vea un
 * destello blanco al entrar con el modo oscuro activo.
 *
 * Va inline en el `<head>`; es la única razón por la que usamos
 * `dangerouslySetInnerHTML` en el proyecto.
 */
export function ThemeScript() {
  const script = `
    try {
      var t = localStorage.getItem("${STORAGE_KEY}");
      if (t === "dark") document.documentElement.classList.add("dark");
    } catch (e) {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
