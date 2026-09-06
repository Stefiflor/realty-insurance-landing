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
      className="relative mt-27.5 scroll-mt-20 overflow-hidden bg-band px-14 py-23"
    >
      <div
        aria-hidden="true"
        className="animate-mesh absolute -top-60 -right-45 size-170 rounded-full bg-[radial-gradient(circle,var(--mesh-1)_0%,transparent_68%)] blur-[110px]"
        style={{ animationDuration: "30s" }}
      />

      <div className="relative grid grid-cols-[400px_minmax(0,1fr)] items-start gap-21">
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
              className="group animate-rise relative grid cursor-pointer grid-cols-[54px_minmax(0,1fr)_200px_26px] items-center gap-5.5 overflow-hidden border-b border-hair-strong py-6 transition-[padding] duration-[550ms] ease-(--ease-brand) hover:pl-5.5"
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

              <div className="relative font-mono text-[11px] tracking-[0.08em] text-dim">
                {product.detail}
              </div>

              <Icon
                name="arrow-right"
                size={16}
                strokeWidth={2.2}
                className="relative -translate-x-2 text-brand opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
