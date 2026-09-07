"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { buildQuery } from "@/lib/domain/filters";
import {
  OPERATIONS,
  PROPERTY_KINDS,
  type Operation,
  type PropertyKind,
} from "@/lib/domain/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Buscador principal de la home.
 *
 * Las pestañas de operación son controladas desde fuera porque también mandan
 * qué propiedades muestra la sección de destacadas: es un único estado que vive
 * en `<PropertyShowcase>`.
 *
 * Los tres campos de abajo, en cambio, son locales: sólo importan al apretar
 * Buscar, que navega al catálogo con todo aplicado.
 */

/** Topes de precio ofrecidos, en dólares. Mismos que el filtro del catálogo. */
const PRICE_STEPS = [50_000, 100_000, 150_000, 200_000, 300_000];

const SELECT_CLASS = cn(
  "w-full cursor-pointer appearance-none bg-transparent pr-6 text-[15px] font-light text-ink",
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand",
);

/**
 * Campo con su etiqueta y la flecha del desplegable.
 *
 * Fuera del componente a propósito: definido adentro, React lo trataría como un
 * componente nuevo en cada render y perdería el foco del `select` al escribir.
 */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-hair px-5 py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:px-6 sm:py-4.5">
      <div className="mb-2 font-mono text-[11px] tracking-[0.14em] text-faint sm:text-[9.5px] sm:tracking-[0.16em]">
        {label}
      </div>
      <div className="relative flex items-center">
        {children}
        <Icon
          name="chevron-down"
          size={13}
          strokeWidth={2}
          className="pointer-events-none absolute right-0 text-faint"
        />
      </div>
    </div>
  );
}

export function SearchBar({
  locale,
  operation,
  onOperationChange,
  cities,
}: {
  locale: Locale;
  operation: Operation;
  onOperationChange: (operation: Operation) => void;
  /** Ciudades con propiedades publicadas, para el desplegable de ubicación. */
  cities: string[];
}) {
  const t = getDictionary(locale);
  const router = useRouter();

  const [city, setCity] = useState("");
  const [kind, setKind] = useState<PropertyKind | "">("");
  const [maxPrice, setMaxPrice] = useState("");

  function search() {
    const query = buildQuery({
      operation,
      city: city || undefined,
      kind: kind || undefined,
      maxPrice: Number(maxPrice) || undefined,
    });
    router.push(`/${locale}/propiedades${query}`);
  }

  return (
    <div className="relative z-20 mx-6 pt-11.5 md:mx-10 lg:mx-14">
      <div className="animate-rise overflow-hidden rounded-md border border-hair-strong bg-surface shadow-lg">
        {/*
          Pestañas de operación. En móvil scrollean en horizontal en vez de
          apilarse: son cuatro y verlas en fila deja claro que hay más opciones.
        */}
        <div
          className="flex items-center gap-[3px] overflow-x-auto px-2.5 pt-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
        >
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
                  "relative shrink-0 cursor-pointer rounded-t px-4 py-3 text-[13.5px] font-medium sm:px-5.5 sm:text-[14px]",
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

        <div className="flex flex-col items-stretch border-t border-hair lg:flex-row">
          <div className="grid grow grid-cols-1 sm:grid-cols-3">
            <Field label={t.search.fields.location.label}>
              <select
                aria-label={t.search.fields.location.label}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={cn(SELECT_CLASS, !city && "text-faint")}
              >
                <option value="">{t.search.fields.location.placeholder}</option>
                {cities.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t.search.fields.kind.label}>
              <select
                aria-label={t.search.fields.kind.label}
                value={kind}
                onChange={(e) => setKind(e.target.value as PropertyKind | "")}
                className={cn(SELECT_CLASS, !kind && "text-faint")}
              >
                <option value="">{t.search.fields.kind.placeholder}</option>
                {PROPERTY_KINDS.map((option) => (
                  <option key={option} value={option}>
                    {t.properties.kinds[option]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t.search.fields.budget.label}>
              <select
                aria-label={t.search.fields.budget.label}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={cn(SELECT_CLASS, !maxPrice && "text-faint")}
              >
                <option value="">{t.search.fields.budget.placeholder}</option>
                {PRICE_STEPS.map((step) => (
                  <option key={step} value={step}>
                    USD {step.toLocaleString("es-AR")}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <button
            type="button"
            onClick={search}
            className={cn(
              "btn-shimmer relative flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden",
              "bg-brand py-4 text-[15px] font-semibold text-white lg:px-9.5 lg:py-0",
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
