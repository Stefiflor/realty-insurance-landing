"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { PropertyImage } from "@/lib/domain/types";

/**
 * Galería de la ficha.
 *
 * Una foto grande más miniaturas. Sin fotos cargadas muestra un marcador
 * evidente en vez de un hueco: deja claro que falta material, no que la página
 * esté rota.
 */
export function Gallery({
  images,
  title,
  placeholder,
  countLabel,
}: {
  images: PropertyImage[];
  title: string;
  placeholder: string;
  countLabel: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-hair bg-gradient-to-br from-[#8a9ba3] via-[#5e7079] to-[#37434a]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-black/45 px-4 py-2 font-mono text-[11px] tracking-[0.16em] text-white/80 backdrop-blur-md">
            {placeholder}
          </span>
        </div>
      </div>
    );
  }

  const current = images[active];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-hair bg-band">
        {/* Sin next/image mientras las URLs vengan de Supabase Storage: su host
            debe declararse en next.config y eso se hace con fotos reales. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={current.alt || title}
          className="size-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
              aria-label="Anterior"
              className="absolute top-1/2 left-3 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Icon name="chevron-left" size={18} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => (i + 1) % images.length)}
              aria-label="Siguiente"
              className="absolute top-1/2 right-3 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Icon name="chevron-right" size={18} strokeWidth={2} />
            </button>
            <div className="absolute right-4 bottom-4 rounded-full bg-black/50 px-3 py-1.5 font-mono text-[11px] text-white backdrop-blur-md">
              {active + 1} / {images.length} {countLabel}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Foto ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded border-2 transition-all sm:h-20 sm:w-28",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                i === active ? "border-brand" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
