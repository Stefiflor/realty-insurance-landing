import type { MetadataRoute } from "next";
import { listPublishedSlugs } from "@/lib/db/properties";
import { LOCALES } from "@/lib/i18n/config";

/**
 * Mapa del sitio para buscadores.
 *
 * Le dice a Google qué páginas existen sin que tenga que descubrirlas siguiendo
 * enlaces. Importa sobre todo para las fichas: son las que traen visitas desde
 * búsquedas concretas ("casa en Martínez") y son muchas.
 *
 * Cada URL declara sus versiones en otros idiomas, para que Google entienda que
 * son la misma página traducida y no contenido duplicado.
 */

/** Se sirve en /sitemap.xml */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");

  const slugs = await listPublishedSlugs();
  const now = new Date();

  /** Arma la entrada de una ruta con sus tres idiomas. */
  const entry = (
    path: string,
    priority: number,
    changeFrequency: "daily" | "weekly" | "monthly",
  ): MetadataRoute.Sitemap => [
    {
      url: `${base}/es${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${base}/${l}${path}`])),
      },
    },
  ];

  return [
    // La home y el catálogo son las puertas principales.
    ...entry("", 1, "weekly"),
    ...entry("/propiedades", 0.9, "daily"),
    // Las fichas cambian menos, pero son las que más búsquedas capturan.
    ...slugs.flatMap((slug) => entry(`/propiedades/${slug}`, 0.8, "weekly")),
  ];
}
