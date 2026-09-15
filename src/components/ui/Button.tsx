import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Botón del sitio.
 *
 * Cuatro variantes, cada una con un trabajo distinto:
 * - `primary`   una sola por pantalla: la acción que el estudio quiere.
 * - `whatsapp`  contacto. Verde de marca de WhatsApp, no el teal del estudio.
 * - `ghost`     acciones secundarias sobre vidrio; no compite con la primaria.
 * - `outline`   acción terciaria, sólo borde.
 * - `glass-dark` como `ghost`, pero con blanco fijo en vez de tokens de tema:
 *   para usar sobre una foto (el Hero), donde el fondo no es `bg-surface`.
 *
 * El brillo diagonal de `primary` y `whatsapp` es decorativo: va en un
 * pseudo-elemento con `pointer-events-none` para no comerse los clics.
 */

type Variant = "primary" | "whatsapp" | "ghost" | "outline" | "glass-dark";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-[0_18px_40px_-16px_rgb(62_142_150/0.8)] btn-shimmer",
  whatsapp:
    "bg-whatsapp text-whatsapp-ink shadow-[0_16px_34px_-14px_rgb(37_211_102/0.75)] btn-shimmer",
  ghost:
    "border border-hair-strong bg-glass backdrop-blur-md text-ink hover:border-brand/40",
  outline: "border border-brand text-brand hover:bg-brand-soft",
  "glass-dark":
    "border border-white/25 bg-black/25 backdrop-blur-md text-white hover:border-white/50",
};

const SIZE: Record<Size, string> = {
  sm: "gap-2 px-4 py-2.5 text-[13px]",
  md: "gap-2.5 px-6 py-3.5 text-[14.5px]",
  lg: "gap-3 px-7.5 py-4 text-[15px]",
};

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps<T extends ElementType> = ButtonOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps | "as">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps<T>) {
  const Component = (as ?? "button") as ElementType;

  return (
    <Component
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center overflow-hidden",
        "rounded-full font-semibold whitespace-nowrap",
        "transition-transform duration-[350ms] ease-(--ease-brand) hover:-translate-y-0.5",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...rest}
    >
      {/* El contenido va sobre el brillo. */}
      <span className="relative z-[2] inline-flex items-center gap-[inherit]">{children}</span>
    </Component>
  );
}
