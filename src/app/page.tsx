import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatAmount, formatLocation, summariseFacts } from "@/lib/domain/format";
import { listFeatured, listInsuranceProducts } from "@/lib/db/properties";

/**
 * Banco de pruebas del design system.
 *
 * Existe para verificar que tokens, primitivos y capa de datos funcionan juntos
 * en claro y oscuro. Se reemplaza por la landing real (`/[locale]/page.tsx`)
 * en el próximo paso.
 */
export default async function DesignSystemPage() {
  const properties = await listFeatured("venta", 3);
  const insurance = await listInsuranceProducts();

  return (
    <main className="mx-auto max-w-[1200px] px-14 py-16">
      <header className="mb-16 flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>

      <SectionHeading kicker="BANCO DE PRUEBAS" title="Design system">
        <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed font-light text-dim">
          Tokens, primitivos y capa de datos. Cambiá a modo oscuro con el botón de arriba
          para verificar que todo responde.
        </p>
      </SectionHeading>

      {/* --- botones --- */}
      <section className="mt-14">
        <h3 className="mb-5 font-mono text-[10.5px] tracking-[0.2em] text-faint">BOTONES</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">
            Ver propiedades
            <Icon name="arrow-right" size={16} strokeWidth={2.2} />
          </Button>
          <Button variant="whatsapp">Escribinos</Button>
          <Button variant="ghost">Secundario</Button>
          <Button variant="outline">Terciario</Button>
          <Button variant="primary" size="sm">
            Chico
          </Button>
        </div>
      </section>

      {/* --- etiquetas --- */}
      <section className="mt-12">
        <h3 className="mb-5 font-mono text-[10.5px] tracking-[0.2em] text-faint">ETIQUETAS</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="live" dot>
            Publicado
          </Badge>
          <Badge tone="review" dot>
            En revisión
          </Badge>
          <Badge tone="draft" dot>
            Borrador
          </Badge>
          <Badge tone="paused" dot>
            Pausado
          </Badge>
          <Badge tone="brand">
            <Icon name="shield" size={11} strokeWidth={2.4} />
            Con seguro
          </Badge>
          <Badge tone="neutral" mono>
            MD-1042
          </Badge>
        </div>
      </section>

      {/* --- íconos --- */}
      <section className="mt-12">
        <h3 className="mb-5 font-mono text-[10.5px] tracking-[0.2em] text-faint">ÍCONOS</h3>
        <div className="flex flex-wrap items-center gap-4 text-brand">
          {(["sale", "key", "land", "shield", "users", "rent", "tool", "mail", "pin"] as const).map(
            (name) => (
              <div
                key={name}
                className="flex size-11 items-center justify-center rounded-[5px] bg-brand-soft"
              >
                <Icon name={name} size={20} />
              </div>
            ),
          )}
        </div>
      </section>

      {/* --- propiedades desde la capa de datos --- */}
      <section className="mt-12">
        <h3 className="mb-5 font-mono text-[10.5px] tracking-[0.2em] text-faint">
          PROPIEDADES · {properties.length} EN VENTA
        </h3>
        <div className="grid grid-cols-3 gap-5">
          {properties.map((property) => (
            <Card key={property.id} lift>
              <div className="h-40 bg-gradient-to-br from-[#8a9ba3] via-[#5e7079] to-[#37434a]" />
              <div className="p-5">
                <div className="mb-2.5 flex items-baseline justify-between gap-3">
                  <span className="text-[26px] font-normal tracking-[-0.032em]">
                    {formatAmount(property.price, "es")}
                  </span>
                  <Badge tone="neutral" mono>
                    {property.code}
                  </Badge>
                </div>
                <div className="mb-1.5 text-[15px]">{property.title}</div>
                <div className="flex items-center gap-1.5 text-[13.5px] font-light text-dim">
                  <Icon name="pin" size={13} />
                  {formatLocation(property)}
                </div>
                <div className="mt-4 flex items-center gap-3.5 border-t border-hair pt-4 font-mono text-[11px] text-dim">
                  {summariseFacts(property, "es").map((fact) => (
                    <span key={fact}>{fact}</span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* --- coberturas --- */}
      <section className="mt-12 mb-8">
        <h3 className="mb-5 font-mono text-[10.5px] tracking-[0.2em] text-faint">COBERTURAS</h3>
        <div className="flex flex-col">
          {insurance.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[54px_1fr_200px] items-center gap-5 border-b border-hair-strong py-5"
            >
              <div className="flex size-11 items-center justify-center rounded-[5px] bg-brand-soft text-brand">
                <Icon name="shield" size={19} />
              </div>
              <div>
                <div className="mb-1 text-[17px] font-medium">{product.name}</div>
                <div className="text-[13.5px] font-light text-dim">{product.description}</div>
              </div>
              <div className="font-mono text-[11px] tracking-[0.08em] text-dim">
                {product.detail}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
