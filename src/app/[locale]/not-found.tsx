import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Página no encontrada.
 *
 * Le pasa sobre todo a una propiedad que se vendió o se dio de baja, y a veces
 * el enlace llega desde un portal o un mensaje viejo. Por eso el texto explica
 * el motivo probable y ofrece salida al listado, en vez de dejar a la persona
 * en un callejón.
 *
 * Next renderiza esta pantalla fuera del contexto de `[locale]`, así que no hay
 * idioma disponible: va en español, el idioma por defecto del sitio.
 */
export default function NotFound() {
  const t = getDictionary(DEFAULT_LOCALE);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden="true"
        className="animate-mesh absolute -top-40 -right-40 size-[600px] rounded-full bg-[radial-gradient(circle,var(--mesh-1)_0%,transparent_68%)] blur-[100px]"
      />

      <div className="relative">
        <LogoMark size={40} className="mx-auto mb-9" />

        <h1 className="m-0 mb-4 text-[clamp(1.75rem,5vw,2.5rem)] leading-tight font-light tracking-[-0.03em] text-balance">
          {t.property.notFoundTitle}
        </h1>

        <p className="mx-auto mb-9 max-w-[42ch] text-[16px] leading-relaxed font-light text-dim">
          {t.property.notFoundSub}
        </p>

        <Button as={Link} href={`/${DEFAULT_LOCALE}#propiedades`} variant="primary" size="lg">
          {t.property.notFoundCta}
          <Icon name="arrow-right" size={16} strokeWidth={2.2} />
        </Button>
      </div>
    </main>
  );
}
