"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Compartir una propiedad.
 *
 * En el celular abre el menú nativo del sistema —desde ahí se manda por
 * WhatsApp en dos toques, que es como circulan las propiedades acá—. En
 * escritorio, donde ese menú no existe, copia el enlace al portapapeles y lo
 * avisa.
 */
export function ShareButton({
  title,
  label,
  copiedLabel,
  className,
}: {
  title: string;
  label: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  // El aviso de "copiado" vuelve a su estado normal solo.
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function share() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Cancelar el menú nativo lanza: no es un error, la persona se
        // arrepintió. Se cae al copiado sólo si tampoco eso funciona.
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Sin permiso de portapapeles no queda nada por hacer; el enlace ya está
      // en la barra de direcciones.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-full border border-hair-strong px-4 py-2.5",
        "text-[13.5px] font-light text-dim transition-colors hover:border-brand/40 hover:text-ink",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        className,
      )}
    >
      <Icon name={copied ? "check" : "share"} size={15} strokeWidth={2} />
      {copied ? copiedLabel : label}
    </button>
  );
}
