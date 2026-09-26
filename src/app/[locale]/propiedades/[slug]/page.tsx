import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HtmlLang } from "@/components/i18n/HtmlLang";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsappFab } from "@/components/layout/WhatsappFab";
import { Gallery } from "@/components/property/Gallery";
import { PropertyCard } from "@/components/property/PropertyCard";
import { ShareButton } from "@/components/property/ShareButton";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import {
  getInsuranceBySlug,
  getPropertyBySlug,
  listPublishedSlugs,
  listSimilar,
} from "@/lib/db/properties";
import { formatAmount, formatLocation, formatPeriod } from "@/lib/domain/format";
import type { EnquiryIntent, InsuranceKind, Property } from "@/lib/domain/types";
import { propertyMessage } from "@/lib/domain/whatsapp";
import { HTML_LANG, LOCALES, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Ficha de una propiedad.
 *
 * Es la página que trae visitas desde buscadores: alguien busca "casa en
 * Martínez" y cae acá, no en la home. Por eso lleva metadata propia y datos
 * estructurados, y se prerenderiza en el build.
 */

type Params = { locale: string; slug: string };

/** Para registrar la consulta con la intención más parecida a la operación. */
const OPERATION_INTENT: Record<Property["operation"], EnquiryIntent> = {
  venta: "comprar",
  alquiler: "alquilar",
  temporario: "alquilar",
  terreno: "terreno",
};

/** Prerenderiza cada propiedad publicada en los tres idiomas. */
export async function generateStaticParams() {
  const slugs = await listPublishedSlugs();
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const property = await getPropertyBySlug(slug);
  if (!property) return {};

  const t = getDictionary(locale);
  // El título del buscador lleva precio y ubicación: es lo que decide el clic.
  const title = `${property.title} · ${formatAmount(property.price, locale)} · ${formatLocation(property)}`;
  const description =
    property.description ||
    `${t.properties.kinds[property.kind]} en ${formatLocation(property)}. ${formatAmount(property.price, locale)}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/propiedades/${slug}`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [HTML_LANG[l], `/${l}/propiedades/${slug}`]),
      ),
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: HTML_LANG[locale],
      images: property.images[0] ? [{ url: property.images[0].url }] : undefined,
    },
  };
}

const INSURANCE_ICON: Record<InsuranceKind, IconName> = {
  hogar: "shield",
  garantia: "users",
  responsabilidad: "rent",
  construccion: "tool",
};

/** Fila de la ficha técnica. Sólo se dibuja si el dato existe. */
function Fact({ label, value }: { label: string; value: string | number | undefined }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hair py-3">
      <span className="text-[14px] font-light text-dim">{label}</span>
      <span className="text-[14.5px] font-medium">{value}</span>
    </div>
  );
}

/**
 * Datos estructurados para buscadores.
 *
 * Con esto Google puede mostrar precio y foto directo en los resultados, en vez
 * de sólo un título y un texto. Es JSON-LD, el formato que espera.
 */
function StructuredData({ property, locale }: { property: Property; locale: Locale }) {
  const t = getDictionary(locale);
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description || undefined,
    url: `/${locale}/propiedades/${property.slug}`,
    image: property.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      price: property.price.amount,
      priceCurrency: property.price.currency,
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location.city,
      addressRegion: property.location.province,
      addressCountry: "AR",
    },
    ...(property.facts.coveredArea && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.facts.coveredArea,
        unitCode: "MTK",
      },
    }),
    ...(property.facts.rooms && { numberOfRooms: property.facts.rooms }),
    additionalType: t.properties.kinds[property.kind],
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD generado por nosotros a partir de datos propios; no hay entrada
      // de terceros que pueda inyectar nada acá.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function PropertyPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const t = getDictionary(locale);
  const [similar, insurance] = await Promise.all([
    listSimilar(property),
    property.insuranceSlug ? getInsuranceBySlug(property.insuranceSlug) : null,
  ]);

  const { facts } = property;
  const areaUnit = facts.areaUnit === "ha" ? "ha" : "m²";
  const message = propertyMessage(property, locale);

  return (
    <>
      <HtmlLang locale={locale} />
      <StructuredData property={property} locale={locale} />
      <SiteHeader locale={locale} />

      <main className="px-6 pt-8 pb-20 md:px-10 lg:px-14">
        {/* volver */}
        <Link
          href={`/${locale}/propiedades`}
          className="mb-4 -ml-2 inline-flex items-center gap-2 rounded px-2 py-2.5 text-[13.5px] font-light text-dim transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Icon name="chevron-left" size={15} strokeWidth={2} />
          {t.property.backToList}
        </Link>

        {/* encabezado */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
              <Badge tone="neutral" mono>
                {property.code}
              </Badge>
              <Badge tone="neutral">{t.properties.kinds[property.kind]}</Badge>
              {property.insuranceSlug && (
                <Badge tone="brand">
                  <Icon name="shield" size={11} strokeWidth={2.4} />
                  {t.properties.insuredBadge}
                </Badge>
              )}
            </div>

            <h1 className="m-0 mb-3 text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.1] font-light tracking-[-0.032em] text-balance">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-2 text-[15px] font-light text-dim">
                <Icon name="pin" size={16} />
                {formatLocation(property)}, {property.location.province}
              </div>
              <ShareButton
                title={property.title}
                label={t.property.share}
                copiedLabel={t.property.shareCopied}
              />
            </div>
          </div>

          <div className="shrink-0 lg:text-right">
            <div className="text-[clamp(2rem,5vw,2.75rem)] leading-none font-light tracking-[-0.04em]">
              {formatAmount(property.price, locale)}
            </div>
            <div className="mt-2 font-mono text-[11px] tracking-[0.12em] text-faint">
              {formatPeriod(property.price, locale)}
            </div>
          </div>
        </div>

        <Gallery
          images={property.images}
          title={property.title}
          placeholder={t.property.galleryPending}
          countLabel={t.property.photoCount}
        />

        {/* cuerpo */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
          <div>
            {/* descripción */}
            <section className="mb-11">
              <h2 className="mb-4 text-[22px] font-light tracking-[-0.02em]">
                {t.property.description}
              </h2>
              <p className="m-0 max-w-[65ch] text-[16px] leading-[1.72] font-light text-dim">
                {property.description || t.property.descriptionPending}
              </p>
            </section>

            {/* características */}
            {facts.highlights.length > 0 && (
              <section className="mb-11">
                <h2 className="mb-4 text-[22px] font-light tracking-[-0.02em]">
                  {t.property.highlights}
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {facts.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="flex items-center gap-2.5 rounded-full border border-hair-strong px-4 py-2.5 text-[13.5px] font-light text-dim"
                    >
                      <span className="size-[5px] rounded-full bg-brand" aria-hidden="true" />
                      {highlight}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* ubicación */}
            <section>
              <h2 className="mb-4 text-[22px] font-light tracking-[-0.02em]">
                {t.property.location}
              </h2>
              {/* Marcador de mapa. Se reemplaza por el mapa real cuando las
                  propiedades tengan coordenadas cargadas. */}
              <div className="relative aspect-[16/7] overflow-hidden rounded-md border border-hair bg-band">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-brand text-white">
                    <Icon name="pin" size={20} />
                  </div>
                  <span className="text-[14px] font-light text-dim">
                    {formatLocation(property)}
                  </span>
                  <span className="font-mono text-[10.5px] tracking-[0.16em] text-faint">
                    {t.property.mapPending}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* columna lateral */}
          <aside className="flex flex-col gap-5">
            {/* ficha técnica */}
            <div className="rounded-md border border-hair bg-surface p-6 shadow-sm">
              <h2 className="mb-4 font-mono text-[10.5px] tracking-[0.18em] text-faint">
                {t.property.facts.title}
              </h2>
              <div className="flex flex-col">
                <Fact label={t.property.facts.operation} value={t.search.operations[property.operation]} />
                <Fact label={t.property.facts.kind} value={t.properties.kinds[property.kind]} />
                <Fact label={t.property.facts.rooms} value={facts.rooms} />
                <Fact label={t.property.facts.bedrooms} value={facts.bedrooms} />
                <Fact label={t.property.facts.bathrooms} value={facts.bathrooms} />
                <Fact
                  label={t.property.facts.coveredArea}
                  value={facts.coveredArea ? `${facts.coveredArea} m²` : undefined}
                />
                <Fact
                  label={t.property.facts.totalArea}
                  value={facts.totalArea ? `${facts.totalArea} ${areaUnit}` : undefined}
                />
                <Fact label={t.property.facts.floor} value={facts.floor} />
                <Fact
                  label={t.property.facts.parking}
                  value={facts.hasParking ? t.property.yes : t.property.no}
                />
                <Fact label={t.property.facts.code} value={property.code} />
              </div>
            </div>

            {/* cobertura */}
            <div className="relative overflow-hidden rounded-md border border-hair bg-surface p-6 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute -top-16 -right-16 size-44 rounded-full bg-[radial-gradient(circle,var(--brand-soft),transparent_70%)] blur-3xl"
              />
              <div className="relative">
                <h2 className="mb-1.5 text-[18px] font-medium tracking-[-0.01em]">
                  {t.property.insuranceTitle}
                </h2>

                {insurance ? (
                  <>
                    <p className="m-0 mb-5 text-[13.5px] leading-relaxed font-light text-dim">
                      {t.property.insuranceSub}
                    </p>
                    <div className="mb-5 flex items-start gap-3.5 rounded border border-hair-strong p-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded bg-brand-soft text-brand">
                        <Icon name={INSURANCE_ICON[insurance.kind]} size={18} />
                      </div>
                      <div>
                        <div className="mb-1 text-[15px] font-medium">{insurance.name}</div>
                        <div className="mb-2 text-[13px] font-light text-dim">
                          {insurance.description}
                        </div>
                        <div className="font-mono text-[10px] tracking-[0.1em] text-faint">
                          {insurance.detail}
                        </div>
                      </div>
                    </div>
                    <WhatsappButton
                      message={message}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      intent="seguro"
                      locale={locale}
                      propertyId={property.id}
                    >
                      {t.property.insuranceAsk}
                    </WhatsappButton>
                  </>
                ) : (
                  <p className="m-0 text-[13.5px] leading-relaxed font-light text-dim">
                    {t.property.insuranceNone}
                  </p>
                )}
              </div>
            </div>

            {/* contacto — pegado al scroll en escritorio */}
            <div className="rounded-md border border-hair-strong bg-surface p-6 shadow-lg lg:sticky lg:top-24">
              <h2 className="mb-1.5 text-[19px] font-medium tracking-[-0.01em]">
                {t.property.ctaTitle}
              </h2>
              <p className="m-0 mb-5 text-[13.5px] leading-relaxed font-light text-dim">
                {t.property.ctaSub}
              </p>
              <WhatsappButton
                message={message}
                size="lg"
                className="w-full"
                intent={OPERATION_INTENT[property.operation]}
                locale={locale}
                propertyId={property.id}
              >
                {t.property.ctaButton}
              </WhatsappButton>
            </div>
          </aside>
        </div>

        {/* similares */}
        <section className="mt-20">
          <h2 className="mb-8 text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.028em]">
            {t.property.similar}
          </h2>
          {similar.length > 0 ? (
            <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item, i) => (
                <PropertyCard key={item.id} property={item} locale={locale} index={i} />
              ))}
            </div>
          ) : (
            <p className="rounded-[5px] border border-dashed border-hair-strong py-12 text-center text-[15px] font-light text-dim">
              {t.property.similarEmpty}
            </p>
          )}
        </section>
      </main>

      <SiteFooter locale={locale} />
      <WhatsappFab locale={locale} />
    </>
  );
}
