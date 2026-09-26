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

export const metadata: Metadata = {
  /*
   * Base para resolver las URLs relativas de `canonical` y `hreflang`. Sin
   * esto Next omite los `hreflang` en silencio y Google no entiende que las
   * tres versiones de idioma son la misma página.
   *
   * En Vercel `VERCEL_PROJECT_PRODUCTION_URL` ya viene seteada; en local cae a
   * localhost. Cuando haya dominio propio, ponelo en NEXT_PUBLIC_SITE_URL.
   */
  metadataBase: new URL(
    // `??` no alcanza: un `.env.local` con la variable presente pero vacía
    // (el caso normal antes de tener dominio propio) da `""`, no `undefined`,
    // y `??` no cae al fallback con eso.
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: {
    default: "MD Estudio Inmobiliario",
    template: "%s · MD Estudio Inmobiliario",
  },
  description:
    "Ventas, alquileres, terrenos y seguros. Un solo estudio de la búsqueda a la escritura.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning` porque ThemeScript toca la clase del <html>
    // antes de que React hidrate: la diferencia es intencional.
    <html lang="es-AR" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${sora.variable} ${instrument.variable} ${jetbrains.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
