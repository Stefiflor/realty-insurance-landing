import type { MetadataRoute } from "next";

/**
 * Instrucciones para los buscadores.
 *
 * Todo el sitio público es indexable. Se bloquea `/admin` porque el panel no
 * tiene nada que hacer en los resultados de Google, y las URLs con filtros,
 * que generan infinitas combinaciones de la misma lista y diluyen el valor
 * de la página de catálogo.
 */
export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/*/propiedades?*"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
