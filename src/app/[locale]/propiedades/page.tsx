import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HtmlLang } from "@/components/i18n/HtmlLang";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsappFab } from "@/components/layout/WhatsappFab";
import { FilterBar } from "@/components/property/FilterBar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { listCities, listProperties } from "@/lib/db/properties";
import { parseFilters } from "@/lib/domain/filters";
import { intentMessage } from "@/lib/domain/whatsapp";
import { HTML_LANG, LOCALES, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Listado de propiedades con filtros.
 *
 * Los filtros viajan en la URL y se resuelven en el servidor, así que la página
 * se renderiza ya filtrada: no hay parpadeo de "cargando" ni una lista completa
 * que después se recorta en el navegador.
 */

type Params = { locale: string };
type Search = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = getDictionary(locale);
  return {
    title: t.listing.title,
    description: t.hero.sub,
    alternates: {
      canonical: `/${locale}/propiedades`,
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], `/${l}/propiedades`])),
    },
  };
}

export default async function PropertiesPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const [{ locale }, search] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();

  const t = getDictionary(locale);
  const filters = parseFilters(search);

  const [properties, cities] = await Promise.all([listProperties(filters), listCities()]);

  return (
    <>
      <HtmlLang locale={locale} />
      <SiteHeader locale={locale} />

      <main className="px-6 pt-12 pb-20 md:px-10 lg:px-14">
        <SectionHeading kicker={t.listing.kicker} title={t.listing.title} className="mb-9" />

        <FilterBar
          locale={locale}
          filters={filters}
          cities={cities}
          resultCount={properties.length}
        />

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property, i) => (
              <PropertyCard
                key={property.id}
                property={property}
                locale={locale}
                // El escalonado se reinicia cada fila para que la última tarjeta
                // de una lista larga no espere varios segundos en aparecer.
                index={i % 4}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-hair-strong px-6 py-16 text-center">
            <h2 className="m-0 mb-3 text-[22px] font-light tracking-[-0.02em]">
              {t.listing.emptyTitle}
            </h2>
            <p className="mx-auto mb-7 max-w-[46ch] text-[15px] leading-relaxed font-light text-dim">
              {t.listing.emptySub}
            </p>
            <WhatsappButton message={intentMessage("comprar", locale)} size="md">
              {t.listing.emptyCta}
            </WhatsappButton>
          </div>
        )}
      </main>

      <SiteFooter locale={locale} />
      <WhatsappFab locale={locale} />
    </>
  );
}
