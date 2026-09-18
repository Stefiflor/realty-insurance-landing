import Image from "next/image";
import { cn } from "@/lib/cn";

/** Proporción real de `logo.png` (1283×700), para no deformarlo en ningún tamaño. */
const LOGO_RATIO = 1283 / 700;

/**
 * Isotipo MD: la imagen de marca provista por el cliente (`/team/logo.png`).
 * No se recolorea ni se recorta — se usa tal cual, con su transparencia.
 */
export function LogoMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/team/logo.png"
      alt="MD Estudio Inmobiliario"
      width={Math.round(size * LOGO_RATIO)}
      height={size}
      className={cn("h-auto shrink-0", className)}
      style={{ height: size, width: "auto" }}
      priority
    />
  );
}

/**
 * Logo completo: isotipo más el nombre del estudio.
 *
 * En pantallas muy angostas la bajada "ESTUDIO INMOBILIARIO" se oculta y queda
 * sólo el isotipo: el nombre completo se come el ancho que necesita el botón
 * de menú.
 */
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 lg:gap-3.5", className)}>
      <LogoMark size={size} />
      <div className="border-l border-hair-strong pl-2.5 lg:pl-3.5">
        <div className="text-[14px] font-bold leading-tight tracking-[0.16em] lg:text-[15px]">
          MD
        </div>
        {/* Es una bajada decorativa que replica el logo impreso, no texto de
            lectura: por eso puede ir por debajo del piso de 11px. */}
        <div className="mt-0.5 hidden font-mono text-[8.5px] font-medium tracking-[0.16em] text-brand sm:block">
          ESTUDIO INMOBILIARIO
        </div>
      </div>
    </div>
  );
}
