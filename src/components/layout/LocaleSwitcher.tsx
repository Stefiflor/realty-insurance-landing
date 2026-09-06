"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { LOCALES, LOCALE_LABEL, switchLocalePath, type Locale } from "@/lib/i18n/config";

/**
 * Selector ES / EN / PT.
 *
 * Son enlaces reales, no botones con estado: cada idioma tiene su URL, así que
 * se puede compartir, indexar y abrir en otra pestaña. Preserva la ruta actual
 * (estando en `/es/propiedades`, "EN" lleva a `/en/propiedades`).
 */
export function LocaleSwitcher({
  current,
  className,
}: {
  current: Locale;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex items-center gap-px rounded-full border border-hair-strong p-[3px]",
        className,
      )}
    >
      {LOCALES.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={switchLocalePath(pathname, locale)}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-2.5 py-[5px] font-mono text-[10.5px] font-medium tracking-[0.06em]",
              "transition-colors duration-[280ms]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              active ? "bg-brand text-white" : "text-dim hover:text-ink",
            )}
          >
            {LOCALE_LABEL[locale]}
          </Link>
        );
      })}
    </div>
  );
}
