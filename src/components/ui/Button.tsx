import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Botón del sitio.
 *
 * Cuatro variantes, cada una con un trabajo distinto:
 * - `primary`   una sola por pantalla: la acción que el estudio quiere.
 * - `whatsapp`  contacto. Verde de marca de WhatsApp, exclusivo de esa acción
 *   (nunca color general de la interfaz).
 * - `ghost`     acciones secundarias sobre una superficie clara.
 * - `outline`   acción terciaria, sólo borde.
 */

type Variant = "primary" | "whatsapp" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong",
  whatsapp: "bg-whatsapp text-whatsapp-ink hover:brightness-105",
  ghost: "border border-hair-strong bg-surface text-ink hover:border-brand/40",
  outline: "border border-brand text-brand hover:bg-brand-soft",
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
        "inline-flex cursor-pointer items-center justify-center gap-[inherit]",
        "rounded-full font-semibold whitespace-nowrap",
        "transition-colors duration-[250ms] ease-(--ease-brand)",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
