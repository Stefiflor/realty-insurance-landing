import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { listEnquiries } from "@/lib/db/admin";
import type { EnquiryIntent } from "@/lib/domain/types";

export const metadata = { title: "Consultas · Panel MD" };

const INTENT_LABEL: Record<EnquiryIntent, string> = {
  comprar: "Quiere comprar",
  alquilar: "Busca alquiler",
  terreno: "Tiene un terreno",
  seguro: "Necesita un seguro",
  tasar: "Quiere tasar",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EnquiriesPage() {
  const enquiries = await listEnquiries();

  return (
    <div>
      <div className="mb-7">
        <h1 className="m-0 text-[22px] font-medium tracking-[-0.01em]">Consultas</h1>
        <p className="m-0 mt-1 text-[13.5px] font-light text-dim">
          Cada clic en un botón de WhatsApp del sitio queda registrado acá, con su intención y
          desde qué propiedad salió (si vino de una ficha).
        </p>
      </div>

      <div className="overflow-hidden rounded-md border border-hair-strong bg-surface">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-hair bg-band text-left font-mono text-[10.5px] tracking-[0.08em] text-faint uppercase">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Intención</th>
              <th className="px-4 py-3 font-medium">Propiedad</th>
              <th className="px-4 py-3 font-medium">Idioma</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.id} className="border-b border-hair last:border-b-0 hover:bg-band/60">
                <td className="px-4 py-3 text-dim">{formatDate(e.createdAt)}</td>
                <td className="px-4 py-3">
                  <Badge tone="neutral">{INTENT_LABEL[e.intent]}</Badge>
                </td>
                <td className="px-4 py-3">
                  {e.property && e.propertyId ? (
                    <Link href={`/admin/propiedades/${e.propertyId}`} className="hover:text-brand">
                      {e.property.code} — {e.property.title}
                    </Link>
                  ) : (
                    <span className="font-light text-faint">Consulta general</span>
                  )}
                </td>
                <td className="px-4 py-3 text-dim uppercase">{e.locale}</td>
              </tr>
            ))}
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center font-light text-dim">
                  Todavía no hay consultas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
