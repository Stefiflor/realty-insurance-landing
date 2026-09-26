import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/i18n/config";

/**
 * Redirige toda ruta sin idioma a su versión localizada: `/` -> `/es`.
 *
 * El idioma se elige mirando el `Accept-Language` del navegador, así un
 * visitante brasileño cae en portugués sin tener que buscarlo. Si su idioma no
 * es uno de los nuestros, va a español.
 */

/** Lee el `Accept-Language` y devuelve el primer idioma que soportamos. */
function detectLocale(request: NextRequest) {
  const header = request.headers.get("accept-language");
  if (!header) return DEFAULT_LOCALE;

  // "pt-BR,pt;q=0.9,en;q=0.8" -> ["pt-br", "pt", "en"], ya ordenado por peso.
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    // Comparamos sólo la parte del idioma: "pt-br" cuenta como "pt".
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // El panel vive en /admin, fuera de [locale]: es interno y va sólo en
  // español. Sin este corte, se le pegaría un prefijo de idioma como a
  // cualquier otra ruta.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  // ¿Ya viene con idioma? Entonces no hay nada que hacer.
  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  /*
   * Se saltea todo lo que no es una página: assets, imágenes optimizadas,
   * la API y los archivos con extensión (favicon, robots.txt, sitemap).
   */
  matcher: ["/((?!_next/static|_next/image|api|.*\\..*).*)"],
};
