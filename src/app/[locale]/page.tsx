import { HtmlLang } from "@/components/i18n/HtmlLang";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsappFab } from "@/components/layout/WhatsappFab";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Insurance } from "@/components/sections/Insurance";
import { PropertyShowcase } from "@/components/sections/PropertyShowcase";
import { Services } from "@/components/sections/Services";
import { Ticker } from "@/components/sections/Ticker";
import { countPublished, listFeatured, listInsuranceProducts } from "@/lib/db/properties";
import { OPERATIONS, type Operation, type Property } from "@/lib/domain/types";
import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  /*
   * Se traen las destacadas de las cuatro operaciones de una vez, en paralelo.
   * Así cambiar de pestaña en el buscador es instantáneo: no hay ida y vuelta
   * al servidor, sólo un cambio de estado en el cliente.
   */
  const [featuredByOperation, insurance, propertyCount] = await Promise.all([
    Promise.all(OPERATIONS.map((operation) => listFeatured(operation, 3))),
    listInsuranceProducts(),
    countPublished(),
  ]);

  const propertiesByOperation = Object.fromEntries(
    OPERATIONS.map((operation, i) => [operation, featuredByOperation[i]]),
  ) as Record<Operation, Property[]>;

  return (
    <>
      <HtmlLang locale={locale} />
      <SiteHeader locale={locale} />

      <main>
        <Hero locale={locale} propertyCount={propertyCount} />
        <Ticker locale={locale} />
        <PropertyShowcase locale={locale} propertiesByOperation={propertiesByOperation} />
        <Services locale={locale} />
        <Insurance locale={locale} products={insurance} />
        <Contact locale={locale} />
      </main>

      <SiteFooter locale={locale} />
      <WhatsappFab locale={locale} />
    </>
  );
}
