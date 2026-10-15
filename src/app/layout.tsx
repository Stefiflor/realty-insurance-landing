import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Sora } from "next/font/google";
import { ThemeProvider, ThemeScript } from "@/components/theme/ThemeProvider";
import "./globals.css";

/**
 * Las tres familias del sitio:
 * - Sora            todo el texto. Geométrica y contemporánea.
 * - Instrument Serif itálica, sólo el acento del hero. Nada más.
 * - JetBrains Mono   etiquetas técnicas, códigos y cifras.
 *
 * `display: swap` para que el texto se lea mientras la fuente carga.
 */
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
  style: "italic",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

/**
 * Base para resolver las URLs relativas de `canonical`, `hreflang` y el JSON-LD
 * de `BusinessSchema`. En Vercel `VERCEL_PROJECT_PRODUCTION_URL` ya viene
 * seteada; en local cae a localhost. Cuando haya dominio propio, ponelo en
 * `NEXT_PUBLIC_SITE_URL`.
 */
const siteUrl =
  // `??` no alcanza: un `.env.local` con la variable presente pero vacía (el
  // caso normal antes de tener dominio propio) da `""`, no `undefined`, y
  // `??` no cae al fallback con eso.
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MD Estudio Inmobiliario",
    template: "%s · MD Estudio Inmobiliario",
  },
  description:
    "Ventas, alquileres, terrenos y seguros. Un solo estudio de la búsqueda a la escritura.",
  // Cuando se verifique el sitio en Search Console (search.google.com/search-console),
  // agregar acá `verification: { google: '<código>' }` con el valor real.
};

/**
 * Datos estructurados del negocio (no de una propiedad puntual).
 *
 * Sin esto, Google sólo "ve" el rubro y la zona de cobertura ficha por ficha.
 * Con esto confirma de entrada que el sitio entero es una inmobiliaria +
 * agencia de seguros en Ushuaia, lo que ayuda a rankear para búsquedas como
 * "inmobiliaria en ushuaia" y no sólo para los títulos de cada propiedad.
 *
 * Va en el layout raíz, no en el de `[locale]`, porque es el mismo dato en
 * las tres versiones de idioma — el nombre del estudio no se traduce.
 */
function BusinessSchema() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
  const data = {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "InsuranceAgency"],
    name: "MD Estudio Inmobiliario",
    image: `${siteUrl}/team/logo.png`,
    url: `${siteUrl}/es`,
    ...(phone && { telephone: `+${phone}` }),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ushuaia",
      addressRegion: "Tierra del Fuego",
      addressCountry: "AR",
    },
    areaServed: {
      "@type": "City",
      name: "Ushuaia",
    },
    sameAs: ["https://www.instagram.com/matiasdip.immo"],
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD generado por nosotros a partir de datos propios; no hay
      // entrada de terceros que pueda inyectar nada acá.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning` porque ThemeScript toca la clase del <html>
    // antes de que React hidrate: la diferencia es intencional.
    <html lang="es-AR" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <BusinessSchema />
      </head>
      <body className={`${sora.variable} ${instrument.variable} ${jetbrains.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
