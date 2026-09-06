"use client";

import { useTheme } from "./ThemeProvider";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** Botón que alterna claro y oscuro. El ícono muestra a dónde vas, no dónde estás. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const goingDark = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={goingDark ? "Activar modo oscuro" : "Activar modo claro"}
      className={cn(
        "flex size-[34px] cursor-pointer items-center justify-center rounded-full",
        "border border-hair-strong text-dim",
        "transition-transform duration-[350ms] ease-(--ease-brand)",
        "hover:-translate-y-0.5 hover:text-ink",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        className,
      )}
    >
      <Icon name={goingDark ? "moon" : "sun"} size={16} />
    </button>
  );
}
