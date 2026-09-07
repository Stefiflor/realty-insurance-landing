"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { buildQuery, hasActiveFilters } from "@/lib/domain/filters";
import {
  OPERATIONS,
  PROPERTY_KINDS,
  SORT_OPTIONS,
  type PropertyFilters,
} from "@/lib/domain/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Filtros del listado.
 *
 * Cada cambio navega a una URL nueva en vez de guardar estado: así la búsqueda
 * queda compartible y el botón de atrás funciona. La navegación la resuelve el
 * servidor, que es quien tiene los datos.
 *
 * En móvil el panel arranca cerrado —ocuparía la pantalla entera antes de que
 * se vea una sola propiedad— y se abre desde un botón que muestra si hay
 * filtros puestos.
 */

/** Topes de precio ofrecidos, en dólares. */
const PRICE_STEPS = [50_000, 100_000, 150_000, 200_000, 300_000];

export function FilterBar({
  locale,
  filters,
  cities,
  resultCount,
}: {
  locale: Locale;
  filters: PropertyFilters;
  cities: string[];
  resultCount: number;
}) {
  const t = getDictionary(locale);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  /** Navega aplicando un cambio sobre los filtros actuales. */
  function update(patch: Partial<PropertyFilters>) {
    const next = { ...filters, ...patch };
    // Un valor vacío significa "sacar este filtro".
    for (const key of Object.keys(next) as Array<keyof PropertyFilters>) {
      if (!next[key]) delete next[key];
    }
    router.push(`/${locale}/propiedades${buildQuery(next)}`, { scroll: false });
  }

  const active = hasActiveFilters(filters);
  const results =
    resultCount === 1
      ? t.listing.resultsOne
      : t.listing.resultsMany.replace("{count}", String(resultCount));

  const selectClass = cn(
    "w-full cursor-pointer appearance-none rounded border border-hair-strong bg-input",
    "px-3.5 py-3 pr-9 text-[14px] font-light text-ink",
    "transition-colors hover:border-brand/40",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  );

  const labelClass = "mb-2 block font-mono text-[10.5px] tracking-[0.14em] text-faint";

  /** Envoltura que agrega la flecha del desplegable. */
  function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div>
        <span className={labelClass}>{label}</span>
        <div className="relative">
          {children}
          <Icon
            name="chevron-down"
            size={14}
            strokeWidth={2}
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-faint"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-9">
      {/* barra: resultados, abrir filtros en móvil, orden */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="text-[15px] font-light text-dim">{results}</div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13.5px] lg:hidden",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              active ? "border-brand bg-brand-soft text-brand" : "border-hair-strong text-dim",
            )}
          >
            <Icon name="filter" size={15} strokeWidth={2} />
            {t.listing.filters}
          </button>

          <div className="relative">
            <select
              aria-label={t.listing.sort}
              value={filters.sort ?? "recent"}
              onChange={(e) => update({ sort: e.target.value as PropertyFilters["sort"] })}
              className={cn(selectClass, "py-2.5 text-[13.5px]")}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {t.listing.sortOptions[option]}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              size={14}
              strokeWidth={2}
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-faint"
            />
          </div>
        </div>
      </div>

      {/* panel de filtros */}
      <div
        className={cn(
          "rounded-md border border-hair bg-surface p-5 shadow-sm",
          open ? "block" : "hidden lg:block",
        )}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t.listing.operation}>
            <select
              value={filters.operation ?? ""}
              onChange={(e) => update({ operation: e.target.value as PropertyFilters["operation"] })}
              className={selectClass}
            >
              <option value="">{t.listing.all}</option>
              {OPERATIONS.map((operation) => (
                <option key={operation} value={operation}>
                  {t.search.operations[operation]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.listing.kind}>
            <select
              value={filters.kind ?? ""}
              onChange={(e) => update({ kind: e.target.value as PropertyFilters["kind"] })}
              className={selectClass}
            >
              <option value="">{t.listing.all}</option>
              {PROPERTY_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {t.properties.kinds[kind]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.listing.city}>
            <select
              value={filters.city ?? ""}
              onChange={(e) => update({ city: e.target.value })}
              className={selectClass}
            >
              <option value="">{t.listing.all}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.listing.price}>
            <select
              value={filters.maxPrice ?? ""}
              onChange={(e) => update({ maxPrice: Number(e.target.value) || undefined })}
              className={selectClass}
            >
              <option value="">{t.listing.noPriceLimit}</option>
              {PRICE_STEPS.map((step) => (
                <option key={step} value={step}>
                  USD {step.toLocaleString("es-AR")}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-hair pt-5">
          <label className="flex cursor-pointer items-center gap-3 text-[14px] font-light text-dim">
            <input
              type="checkbox"
              checked={filters.insuredOnly ?? false}
              onChange={(e) => update({ insuredOnly: e.target.checked || undefined })}
              className="size-4.5 cursor-pointer accent-[var(--brand)]"
            />
            {t.listing.insuredOnly}
          </label>

          {active && (
            <button
              type="button"
              onClick={() => router.push(`/${locale}/propiedades`, { scroll: false })}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-[13.5px] font-medium text-brand transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Icon name="close" size={14} strokeWidth={2.2} />
              {t.listing.clear}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
