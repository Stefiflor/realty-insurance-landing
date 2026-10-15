import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HTML_LANG, LOCALES, isLocale, type Locale } from "@/lib/i18n/config";

/** Prerenderiza los tres idiomas en el build. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "MD Estudio Inmobiliario · Inmobiliaria en Ushuaia",
    description:
      "Ventas, alquileres, terrenos y seguros en Ushuaia, Tierra del Fuego. Un solo estudio de la búsqueda a la escritura.",
  },
  en: {
    title: "MD Estudio Inmobiliario · Real Estate in Ushuaia",
    description:
      "Sales, rentals, land and insurance in Ushuaia, Tierra del Fuego. One firm from the first search to the deed.",
  },
  pt: {
    title: "MD Estudio Inmobiliario · Imobiliária em Ushuaia",
    description:
      "Vendas, aluguéis, terrenos e seguros em Ushuaia, Tierra del Fuego. Um só escritório da busca até a escritura.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const meta = META[locale];
  return {
    title: meta.title,
    description: meta.description,
    // Le dice a Google que estas tres páginas son la misma en distintos idiomas.
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], `/${l}`])),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: HTML_LANG[locale],
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return children;
}
