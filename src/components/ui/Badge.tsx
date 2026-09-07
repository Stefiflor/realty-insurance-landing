import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ListingState } from "@/lib/domain/types";

/**
 * Etiqueta chica. Se usa para el estado de un aviso, la marca "Con seguro" y
 * las categorías sobre las fotos.
 */

type Tone = "brand" | "neutral" | "glass" | "live" | "review" | "draft" | "paused";

const TONE: Record<Tone, string> = {
  brand: "bg-brand text-white",
  neutral: "bg-brand-soft text-brand",
  // Sobre foto: vidrio oscuro para que se lea sin importar la imagen debajo.
  glass: "bg-black/60 backdrop-blur-md border border-white/15 text-white",
  live: "bg-(--state-live-bg) text-(--state-live-fg)",
  review: "bg-(--state-review-bg) text-(--state-review-fg)",
  draft: "bg-(--state-draft-bg) text-(--state-draft-fg)",
  paused: "bg-(--state-paused-bg) text-(--state-paused-fg)",
};

/** Cada estado de aviso tiene su tono; así el color nunca se elige a mano. */
export const STATE_TONE: Record<ListingState, Tone> = {
  publicado: "live",
  revision: "review",
  borrador: "draft",
  pausado: "paused",
};

export function Badge({
  tone = "neutral",
  dot = false,
  mono = false,
  className,
  children,
}: {
  tone?: Tone;
  /** Punto del color del texto, para los estados. */
  dot?: boolean;
  /** Monoespaciada en versalitas, para etiquetas técnicas. */
  mono?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        // El mono arranca en 11px (piso legible) y baja a 9.5px desde `sm`,
        // donde ya hay espacio suficiente para que se lea igual.
        mono
          ? "font-mono text-[11px] tracking-[0.1em] sm:text-[9.5px] sm:tracking-[0.13em]"
          : "text-[11px] font-semibold",
        TONE[tone],
        className,
      )}
    >
      {dot && <span className="size-[5px] rounded-full bg-current" />}
      {children}
    </span>
  );
}
