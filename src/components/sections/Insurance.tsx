import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { intentMessage } from "@/lib/domain/whatsapp";
import type { InsuranceKind, InsuranceProduct } from "@/lib/domain/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/** Cada familia de cobertura tiene su ícono fijo. */
const KIND_ICON: Record<InsuranceKind, IconName> = {
  hogar: "shield",
  garantia: "users",
  responsabilidad: "rent",
  construccion: "tool",
};

/**
 * Coberturas.
 *
 * Los nombres y descripciones vienen de la base, no del diccionario: son datos
 * del catálogo del estudio, no textos de la interfaz. Por ahora se muestran en
 * el idioma en que estén cargados.
 */
export function Insurance({
  locale,
  products,
}: {
  locale: Locale;
  products: InsuranceProduct[];
}) {
  const t = getDictionary(locale);

  return (
    <section
      id="seguros"
      className="relative mt-18 scroll-mt-20 bg-band px-6 py-16 md:px-10 lg:mt-27.5 lg:px-14 lg:py-23"
    >

      <div className="relative grid grid-cols-1 items-start gap-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[400px_minmax(0,1fr)] xl:gap-21">
        <div>
          <SectionHeading kicker={t.insurance.kicker} title={t.insurance.title}>
            <p className="mt-5 mb-7.5 text-[16px] leading-[1.68] font-light text-dim">
              {t.insurance.sub}
            </p>
            <WhatsappButton
              message={intentMessage("seguro", locale)}
              variant="outline"
              size="md"
            >
              {t.insurance.cta}
            </WhatsappButton>
          </SectionHeading>
        </div>

        <div className="flex flex-col">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="group animate-rise relative grid cursor-pointer grid-cols-[44px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 overflow-hidden border-b border-hair-strong py-5 transition-[padding] duration-[550ms] ease-(--ease-brand) hover:pl-5.5 sm:grid-cols-[54px_minmax(0,1fr)_auto_26px] sm:gap-5.5 sm:py-6"
              style={{ animationDelay: `${0.06 * i}s` }}
            >
              {/* baño que barre de izquierda a derecha */}
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-left scale-x-0 bg-[linear-gradient(90deg,var(--brand-soft)_0%,transparent_70%)] transition-transform duration-[600ms] ease-(--ease-brand) group-hover:scale-x-100"
              />

              <div className="relative flex size-11 items-center justify-center rounded-[5px] bg-brand-soft text-brand">
                <Icon name={KIND_ICON[product.kind]} size={19} />
              </div>

              <div className="relative">
                <div className="mb-1.5 text-[17px] font-medium">{product.name}</div>
                <div className="text-[13.5px] font-light text-dim">{product.description}</div>
              </div>

              {/* En móvil el detalle pasa abajo, alineado bajo el nombre. */}
              <div className="relative col-start-2 font-mono text-[10.5px] tracking-[0.08em] text-dim sm:col-start-auto sm:text-[11px]">
                {product.detail}
              </div>

              <Icon
                name="arrow-right"
                size={16}
                strokeWidth={2.2}
                className="relative hidden -translate-x-2 text-brand opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 sm:block"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
