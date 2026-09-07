"use client";

import Link from "next/link";
import { useState } from "react";
import { PropertyCard, PropertyRow } from "@/components/property/PropertyCard";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { usePointerGlow } from "@/lib/hooks/usePointerGlow";
import type { Operation, Property } from "@/lib/domain/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Buscador + propiedades destacadas.
 *
 * Van juntos en un mismo componente porque comparten la operación elegida:
 * tocar "Alquiler" en el buscador cambia las propiedades de abajo. Separarlos
 * obligaría a levantar ese estado a la página entera y volverla cliente.
 *
 * Recibe las propiedades ya agrupadas por operación desde el servidor, así el
 * cambio de pestaña es instantáneo y no dispara una consulta.
 */
export function PropertyShowcase({
  locale,
  propertiesByOperation,
}: {
  locale: Locale;
  propertiesByOperation: Record<Operation, Property[]>;
}) {
  const t = getDictionary(locale);
  const [operation, setOperation] = useState<Operation>("venta");
  const [view, setView] = useState<"grid" | "list">("grid");

  usePointerGlow();

  const properties = propertiesByOperation[operation];

  return (
    <>
      <SearchBar locale={locale} operation={operation} onOperationChange={setOperation} />

      <section id="propiedades" className="scroll-mt-20 px-6 pt-18 md:px-10 lg:px-14 lg:pt-27.5">
        <div className="mb-9.5 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end sm:gap-0">
          <SectionHeading kicker={t.properties.kicker} title={t.properties.title} />

          <div
            className="flex items-center gap-[3px] rounded-full border border-hair-strong p-1"
            role="tablist"
          >
            {(["grid", "list"] as const).map((mode) => {
              const active = view === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setView(mode)}
                  className={cn(
                    "cursor-pointer rounded-full px-5 py-2.5 text-[13.5px] font-medium",
                    "transition-colors duration-[320ms]",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    active ? "bg-brand text-white" : "text-dim hover:text-ink",
                  )}
                >
                  {t.properties.views[mode]}
                </button>
              );
            })}
          </div>
        </div>

        {properties.length === 0 ? (
          <p className="rounded-[5px] border border-dashed border-hair-strong py-16 text-center text-[15px] font-light text-dim">
            {t.properties.empty}
          </p>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} locale={locale} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {properties.map((property, i) => (
              <PropertyRow key={property.id} property={property} locale={locale} index={i} />
            ))}
          </div>
        )}

        {/* La home muestra sólo tres destacadas por operación: el catálogo
            completo con filtros vive en su propia página. */}
        <div className="mt-9 flex justify-center">
          <Button
            as={Link}
            href={`/${locale}/propiedades?operacion=${operation}`}
            variant="ghost"
            size="md"
          >
            {t.listing.title}
            <Icon name="arrow-right" size={16} strokeWidth={2.2} />
          </Button>
        </div>
      </section>
    </>
  );
}
