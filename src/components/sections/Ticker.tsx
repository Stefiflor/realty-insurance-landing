import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Marquesina con las aseguradoras con las que trabaja el estudio.
 *
 * La lista va dos veces: la animación desplaza el 50% del ancho, así que
 * cuando termina la primera copia la segunda está justo donde empezó la
 * primera y el bucle no tiene salto.
 *
 * Los logos van en gris y chicos a propósito: es una tira de confianza, no
 * un anuncio — no tienen que competir con el resto de la página.
 *
 * Se reducen a una silueta sólida sin importar el color original de cada
 * marca (el celeste de Mercantil Andina, el azul de Allianz...), así todos
 * leen parejo, y se dan vuelta a blanco en modo oscuro. El filtro sale de
 * `--carrier-logo-filter` en vez de la utilidad `dark:` de Tailwind: el tema
 * acá se controla con una clase `.dark` en `<html>`, no con el sistema
 * operativo, y `dark:` reacciona a este último.
 *
 * Tampoco van todos al mismo alto: Federación Patronal, San Cristóbal y
 * Mercantil Andina tienen el nombre completo en letra fina y leen chico
 * comparados con Allianz o Swiss Medical a la misma altura, así que llevan
 * un `size` mayor para pesar parecido en la tira.
 */
const CARRIERS = [
  { src: "/logo/federacion-patronal.png", alt: "Federación Patronal Seguros", width: 1000, height: 167, size: "h-7" },
  { src: "/logo/san-cristobal.png", alt: "San Cristóbal Seguros", width: 381, height: 131, size: "h-8" },
  { src: "/logo/allianz.png", alt: "Allianz", width: 340, height: 85, size: "h-5" },
  { src: "/logo/mercantil-andina.png", alt: "Mercantil Andina Seguros", width: 3460, height: 644, size: "h-7" },
  { src: "/logo/swiss-medical.png", alt: "Swiss Medical", width: 536, height: 80, size: "h-5" },
];

export function Ticker() {
  const items = [...CARRIERS, ...CARRIERS];

  return (
    <div
      className="relative overflow-hidden border-y border-hair bg-band py-[18px]"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max items-center">
        {items.map((carrier, i) => (
          <div key={`${carrier.src}-${i}`} className="flex items-center gap-4 px-6.5">
            <span className="size-1 shrink-0 rounded-full bg-brand" />
            <Image
              src={carrier.src}
              alt={carrier.alt}
              width={carrier.width}
              height={carrier.height}
              className={cn(carrier.size, "w-auto shrink-0 object-contain")}
              style={{ filter: "var(--carrier-logo-filter)", opacity: "var(--carrier-logo-opacity)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
