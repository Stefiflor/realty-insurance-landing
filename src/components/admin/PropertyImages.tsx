"use client";

import { useRef, useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import type { AdminPropertyImage } from "@/lib/db/admin";
import {
  addPropertyImageAction,
  removePropertyImageAction,
} from "@/app/admin/(dashboard)/propiedades/actions";

/**
 * Fotos de una propiedad. Vive aparte de `PropertyForm` porque necesita el
 * `id` de la propiedad para subir a storage — no tiene sentido antes de
 * guardarla por primera vez.
 */
export function PropertyImages({
  propertyId,
  images,
}: {
  propertyId: string;
  images: AdminPropertyImage[];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    startTransition(async () => {
      try {
        let position = images.length;
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.set("file", file);
          formData.set("position", String(position));
          await addPropertyImageAction(propertyId, formData);
          position += 1;
        }
      } catch {
        setError("No se pudo subir alguna foto. Probá de nuevo.");
      }
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function handleRemove(image: AdminPropertyImage) {
    startTransition(() => removePropertyImageAction(propertyId, image.id, image.path));
  }

  return (
    <div className="mt-10 max-w-[760px] border-t border-hair pt-8">
      <h2 className="mb-1 text-[16px] font-medium">Fotos</h2>
      <p className="m-0 mb-5 text-[13px] font-light text-dim">
        La primera es la portada. Se suben directo al storage de Supabase.
      </p>

      {error && (
        <div className="mb-4 rounded-[5px] border border-(--state-paused-fg)/30 bg-(--state-paused-bg) px-4 py-2.5 text-[13px] text-(--state-paused-fg)">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, i) => (
          <div
            key={image.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-[5px] border border-hair-strong bg-band"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.alt} className="size-full object-cover" />
            {i === 0 && (
              <span className="absolute top-2 left-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-medium text-white">
                Portada
              </span>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={() => handleRemove(image)}
              className="absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Borrar foto"
            >
              <Icon name="trash" size={13} />
            </button>
          </div>
        ))}

        <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-[5px] border border-dashed border-hair-strong text-dim transition-colors hover:border-brand/40 hover:text-brand">
          <Icon name="upload" size={20} />
          <span className="text-[12px] font-medium">{pending ? "Subiendo..." : "Agregar"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={pending}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
    </div>
  );
}
