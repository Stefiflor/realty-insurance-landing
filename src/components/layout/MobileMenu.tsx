"use client";

import { useEffect, useState } from "react";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Icon } from "@/components/ui/Icon";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { cn } from "@/lib/cn";
import { intentMessage } from "@/lib/domain/whatsapp";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Menú de navegación para pantallas chicas.
 *
 * Se despliega a pantalla completa desde el header. Los enlaces son anclas a
 * las secciones de la home, así que al tocar uno hay que cerrar el panel: si no,
 * la página scrollea detrás de un menú abierto.
 */
export function MobileMenu({
  locale,
  anchors,
}: {
  locale: Locale;
  anchors: string[];
}) {
  const t = getDictionary(locale);
  const [open, setOpen] = useState(false);

  // Con el panel abierto el fondo no debe scrollear.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape cierra, como en cualquier panel modal.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.nav.openMenu}
        aria-expanded={open}
        className={cn(
          "flex size-11 cursor-pointer items-center justify-center rounded-full",
          "border border-hair-strong text-dim transition-colors hover:text-ink",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          "lg:hidden",
        )}
      >
        <Icon name="menu" size={19} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg lg:hidden">
          <div className="flex items-center justify-between border-b border-hair px-6 py-[18px]">
            <LocaleSwitcher current={locale} />
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.nav.closeMenu}
                className={cn(
                  "flex size-11 cursor-pointer items-center justify-center rounded-full",
                  "border border-hair-strong text-dim transition-colors hover:text-ink",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                )}
              >
                <Icon name="close" size={19} />
              </button>
            </div>
          </div>

          <nav className="flex grow flex-col justify-center gap-2 px-6">
            {t.nav.links.map((label, i) => (
              <a
                key={label}
                href={anchors[i]}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between border-b border-hair py-5",
                  "text-[26px] font-light tracking-[-0.02em] transition-colors hover:text-brand",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                )}
              >
                {label}
                <Icon name="arrow-right" size={20} className="text-faint" />
              </a>
            ))}
          </nav>

          <div className="px-6 pb-10">
            <WhatsappButton
              message={intentMessage("comprar", locale)}
              size="lg"
              className="w-full"
            >
              {t.nav.cta}
            </WhatsappButton>
          </div>
        </div>
      )}
    </>
  );
}
