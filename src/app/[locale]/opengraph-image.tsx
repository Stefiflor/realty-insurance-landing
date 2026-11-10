import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Imagen de vista previa (og:image) para la home y cualquier página que no
 * defina la suya propia — la ficha de propiedad sí define la suya (la foto
 * real del aviso) y esta queda como fallback sin aplicarle.
 *
 * Importa sobre todo para WhatsApp: es el único canal de contacto del
 * estudio, y hasta ahora un link compartido no mostraba ninguna vista previa.
 */

export const runtime = "nodejs";
export const alt = "MD Estudio Inmobiliario — Ushuaia, Tierra del Fuego";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Proporción real de `logo.png` (900×424): ver Logo.tsx. */
const LOGO_RATIO = 900 / 424;
const LOGO_HEIGHT = 84;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "es";
  const t = getDictionary(locale);

  const logoBuffer = await readFile(path.join(process.cwd(), "public/team/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#f7f3eb",
          fontFamily: "sans-serif",
        }}
      >
        {/* isotipo + wordmark, igual que el header del sitio */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <img
            src={logoSrc}
            // Decorativa: el wordmark de al lado ya da el nombre como texto.
            alt=""
            width={Math.round(LOGO_HEIGHT * LOGO_RATIO)}
            height={LOGO_HEIGHT}
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderLeft: "2px solid rgb(220 213 202)",
              paddingLeft: 22,
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4, color: "#202327" }}>
              MD
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: 3,
                color: "#f36b21",
              }}
            >
              ESTUDIO INMOBILIARIO
            </div>
          </div>
        </div>

        {/* título + bajada, igual jerarquía que el Hero */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 940 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 50, fontWeight: 700, color: "#202327", lineHeight: 1.2 }}>
              {t.hero.line1}
            </div>
            <div style={{ fontSize: 50, fontWeight: 700, color: "#f36b21", lineHeight: 1.2 }}>
              {t.hero.line2}
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 400, color: "#6f706f", lineHeight: 1.4 }}>
            {t.hero.sub}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 18,
              letterSpacing: 3,
              color: "#6f706f",
            }}
          >
            <div
              style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: "#f36b21" }}
            />
            USHUAIA · TIERRA DEL FUEGO
          </div>
        </div>

        {/* barra de marca, discreta */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 8,
            borderRadius: 999,
            backgroundImage: "linear-gradient(90deg, #f36b21, #f5a623)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
