import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Superficie elevada. Es la base de las tarjetas de propiedad, los servicios y
 * los paneles de métricas.
 *
 * `glow` agrega el halo que sigue al cursor; requiere que un ancestro monte
 * `usePointerGlow` para que las coordenadas se escriban.
 */
export function Card({
  glow = false,
  lift = false,
  className,
  children,
}: {
  glow?: boolean;
  /** Se levanta al pasar el cursor. Para tarjetas que llevan a otra página. */
  lift?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[5px] border border-hair bg-surface shadow-sm",
        glow && "card-glow",
        lift &&
          "transition-transform duration-[600ms] ease-(--ease-brand) hover:-translate-y-2.5",
        className,
      )}
    >
      {children}
    </div>
  );
}
