import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Encabezado de sección: raya corta + etiqueta monoespaciada + título.
 *
 * Se repite en servicios, propiedades, coberturas y contacto. Está acá para que
 * el ritmo sea idéntico en todas: si cambia el espaciado, cambia en una sola
 * parte y no en cuatro.
 */
export function SectionHeading({
  kicker,
  title,
  className,
  children,
}: {
  /** Etiqueta corta en versalitas, ej. "QUÉ HACEMOS". */
  kicker: string;
  title: string;
  className?: string;
  /** Contenido opcional debajo del título (una bajada, un botón). */
  children?: ReactNode;
}) {
  return (
    <div className={className}>
      <div className="mb-[18px] flex items-center gap-3">
        <span className="h-px w-7 bg-brand" aria-hidden="true" />
        <span className="font-mono text-[10.5px] font-medium tracking-[0.2em] text-brand">
          {kicker}
        </span>
      </div>
      <h2
        className={cn(
          "m-0 text-[46px] leading-[1.1] font-light tracking-[-0.032em]",
          "text-balance",
        )}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
