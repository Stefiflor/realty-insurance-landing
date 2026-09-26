import Link from "next/link";
import { Badge, STATE_TONE } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { requireStaff } from "@/lib/auth/session";
import { listAllProperties } from "@/lib/db/admin";
import { formatAmount } from "@/lib/domain/format";
import { DeleteButton } from "./DeleteButton";

export const metadata = { title: "Propiedades · Panel MD" };

const STATE_LABEL = {
  publicado: "Publicado",
  revision: "En revisión",
  borrador: "Borrador",
  pausado: "Pausado",
};

export default async function PropertiesListPage({
  searchParams,
}: {
  searchParams: Promise<{ guardado?: string }>;
}) {
  const [session, properties, { guardado }] = await Promise.all([
    requireStaff(),
    listAllProperties(),
    searchParams,
  ]);

  return (
    <div>
      {guardado && (
        <div className="mb-6 flex items-center gap-2.5 rounded-[5px] border border-(--state-live-fg)/30 bg-(--state-live-bg) px-4 py-3 text-[13.5px] text-(--state-live-fg)">
          <Icon name="check" size={16} />
          Propiedad guardada correctamente.
        </div>
      )}

      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="m-0 text-[22px] font-medium tracking-[-0.01em]">Propiedades</h1>
          <p className="m-0 mt-1 text-[13.5px] font-light text-dim">
            {properties.length} en total.
          </p>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="flex items-center gap-2 rounded-full bg-brand px-4.5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          <Icon name="plus" size={15} />
          Nueva propiedad
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-hair-strong bg-surface">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-hair bg-band text-left font-mono text-[10.5px] tracking-[0.08em] text-faint uppercase">
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Operación</th>
              <th className="px-4 py-3 font-medium">Ciudad</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b border-hair last:border-b-0 hover:bg-band/60">
                <td className="px-4 py-3 font-mono text-[12px] text-faint">{p.code}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/propiedades/${p.id}`} className="font-medium hover:text-brand">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-dim capitalize">{p.operation}</td>
                <td className="px-4 py-3 text-dim">{p.location.city}</td>
                <td className="px-4 py-3 text-dim">{formatAmount(p.price, "es")}</td>
                <td className="px-4 py-3">
                  <Badge tone={STATE_TONE[p.state]} dot mono>
                    {STATE_LABEL[p.state]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/propiedades/${p.id}`}
                      className="text-dim hover:text-brand"
                      aria-label="Editar"
                    >
                      <Icon name="edit" size={16} />
                    </Link>
                    {session.role === "admin" && <DeleteButton propertyId={p.id} title={p.title} />}
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center font-light text-dim">
                  Todavía no cargaste ninguna propiedad.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
