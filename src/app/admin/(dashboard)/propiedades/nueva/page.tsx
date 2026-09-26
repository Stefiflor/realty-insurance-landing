import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { requireStaff } from "@/lib/auth/session";
import { listInsuranceProducts } from "@/lib/db/properties";
import { createPropertyAction } from "../actions";

export const metadata = { title: "Nueva propiedad · Panel MD" };

export default async function NewPropertyPage() {
  const [session, insuranceProducts] = await Promise.all([
    requireStaff(),
    listInsuranceProducts(),
  ]);

  return (
    <div>
      <Link
        href="/admin/propiedades"
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-dim hover:text-brand"
      >
        <Icon name="chevron-left" size={14} />
        Propiedades
      </Link>
      <h1 className="m-0 mb-7 text-[22px] font-medium tracking-[-0.01em]">Nueva propiedad</h1>

      <PropertyForm
        action={createPropertyAction}
        insuranceProducts={insuranceProducts}
        role={session.role}
      />

      <p className="mt-6 max-w-[760px] text-[12.5px] font-light text-faint">
        Las fotos se cargan entrando a la propiedad ya creada, desde el listado.
      </p>
    </div>
  );
}
