"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { OPERATIONS, type Operation } from "@/lib/domain/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Buscador principal.
 *
 * Las pestañas de operación son controladas desde fuera porque también mandan
 * qué propiedades muestra la sección de destacadas: es un único estado que vive
 * en `<FeaturedProperties>`.
 *
 * Los tres campos son maqueta por ahora — se convierten en selects reales
 * cuando exista la página de resultados con filtros.
 */
export function SearchBar({
  locale,
  operation,
  onOperationChange,
}: {
  locale: Locale;
  operation: Operation;
  onOperationChange: (operation: Operation) => void;
}) {
  const t = getDictionary(locale);
  const fields = [t.search.fields.location, t.search.fields.kind, t.search.fields.budget];

  return (
    <div className="relative z-20 mx-14 pt-11.5">
      <div className="animate-rise overflow-hidden rounded-md border border-hair-strong bg-surface shadow-lg">
        {/* pestañas de operación */}
        <div className="flex items-center gap-[3px] px-2.5 pt-2.5" role="tablist">
          {OPERATIONS.map((op) => {
            const active = op === operation;
            return (
              <button
                key={op}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onOperationChange(op)}
                className={cn(
                  "relative cursor-pointer rounded-t px-5.5 py-3 text-[14px] font-medium",
                  "transition-colors duration-[320ms]",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand",
                  active ? "bg-brand-soft text-brand" : "text-dim hover:text-ink",
                )}
              >
                {t.search.operations[op]}
                <span
                  className={cn(
                    "absolute inset-x-3 bottom-0 h-0.5 rounded-sm",
                    active ? "bg-brand" : "bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* campos + acción */}
        <div className="flex items-stretch border-t border-hair">
          <div className="grid grow grid-cols-3">
            {fields.map((field) => (
              <div key={field.label} className="border-r border-hair px-6 py-4.5">
                <div className="mb-2 font-mono text-[9.5px] tracking-[0.16em] text-faint">
                  {field.label}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[15px] font-light text-faint">{field.placeholder}</span>
                  <Icon name="chevron-down" size={13} strokeWidth={2} className="shrink-0 text-faint" />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={cn(
              "btn-shimmer relative flex cursor-pointer items-center gap-2.5 overflow-hidden",
              "bg-brand px-9.5 text-[15px] font-semibold text-white",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white",
            )}
          >
            <Icon name="search" size={17} strokeWidth={2.3} className="relative z-[2]" />
            <span className="relative z-[2]">{t.search.action}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
