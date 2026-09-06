import { cn } from "@/lib/cn";

/**
 * Isotipo MD, redibujado en SVG a partir del logo del estudio.
 *
 * La contraforma de la "D" es un hueco: se pinta del color del fondo sobre el
 * que se apoya, así que hay que pasarle `holeClassName` cuando el logo va sobre
 * una superficie que no es la de la página (una barra, una tarjeta).
 */
export function LogoMark({
  size = 32,
  className,
  holeClassName = "fill-bg",
}: {
  size?: number;
  className?: string;
  /** Clase que pinta la contraforma de la D. Debe igualar al fondo detrás. */
  holeClassName?: string;
}) {
  const height = size;
  const width = (38 / 30) * size;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 38 30"
      fill="none"
      className={className}
      role="img"
      aria-label="MD Estudio Inmobiliario"
    >
      {/* la M */}
      <rect x="1" y="1" width="10" height="26" className="fill-ink" />
      <rect x="13.5" y="1" width="4" height="26" className="fill-ink" />
      {/* la D, con su contraforma y el subrayado */}
      <rect x="20" y="1" width="17" height="17" className="fill-brand" />
      <rect x="24.5" y="5.5" width="12.5" height="12.5" className={holeClassName} />
      <rect x="20" y="24" width="17" height="3" className="fill-brand" />
    </svg>
  );
}

/**
 * Logo completo: isotipo más el nombre del estudio.
 *
 * En pantallas muy angostas la bajada "ESTUDIO INMOBILIARIO" se oculta y queda
 * sólo el isotipo con "MD": el nombre completo se come el ancho que necesita el
 * botón de menú.
 */
export function Logo({
  size = 32,
  className,
  holeClassName,
}: {
  size?: number;
  className?: string;
  holeClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5 lg:gap-3.5", className)}>
      <LogoMark size={size} holeClassName={holeClassName} className="shrink-0" />
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
