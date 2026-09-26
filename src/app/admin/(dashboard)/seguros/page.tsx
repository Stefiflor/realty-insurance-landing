import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { listInsuranceProducts } from "@/lib/db/properties";
import { DeleteInsuranceButton } from "./DeleteInsuranceButton";

export const metadata = { title: "Seguros · Panel MD" };

export default async function InsuranceListPage() {
  const products = await listInsuranceProducts();

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="m-0 text-[22px] font-medium tracking-[-0.01em]">Seguros</h1>
          <p className="m-0 mt-1 text-[13.5px] font-light text-dim">
            El catálogo que se muestra en la web.
          </p>
        </div>
        <Link
          href="/admin/seguros/nuevo"
          className="flex items-center gap-2 rounded-full bg-brand px-4.5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          <Icon name="plus" size={15} />
          Nueva cobertura
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-md border border-hair-strong bg-surface p-4"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[5px] bg-brand-soft text-brand">
              <Icon name="shield" size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{p.name}</div>
              <div className="truncate text-[13px] font-light text-dim">{p.description}</div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link href={`/admin/seguros/${p.id}`} className="text-dim hover:text-brand" aria-label="Editar">
                <Icon name="edit" size={16} />
              </Link>
              <DeleteInsuranceButton id={p.id} name={p.name} />
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="rounded-md border border-dashed border-hair-strong p-8 text-center font-light text-dim">
            Todavía no cargaste ninguna cobertura.
          </p>
        )}
      </div>
    </div>
  );
}
