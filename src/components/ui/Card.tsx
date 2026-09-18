import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Superficie elevada. Es la base de las tarjetas de propiedad, los servicios y
 * los paneles de métricas.
 */
export function Card({
  lift = false,
  className,
  children,
}: {
  /** Se levanta al pasar el cursor. Para tarjetas que llevan a otra página. */
  lift?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[5px] border border-hair bg-surface shadow-sm",
        lift &&
          "transition-transform duration-[600ms] ease-(--ease-brand) hover:-translate-y-2.5",
        className,
      )}
    >
      {children}
    </div>
  );
}
