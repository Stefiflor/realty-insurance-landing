import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { PropertyImages } from "@/components/admin/PropertyImages";
import { requireStaff } from "@/lib/auth/session";
import { getPropertyForEdit, listPropertyImages } from "@/lib/db/admin";
import { listInsuranceProducts } from "@/lib/db/properties";
import { updatePropertyAction } from "../actions";

export const metadata = { title: "Editar propiedad · Panel MD" };

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [session, property, images, insuranceProducts] = await Promise.all([
    requireStaff(),
    getPropertyForEdit(id),
    listPropertyImages(id),
    listInsuranceProducts(),
  ]);

  if (!property) notFound();

  const boundUpdate = updatePropertyAction.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/propiedades"
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-dim hover:text-brand"
      >
        <Icon name="chevron-left" size={14} />
        Propiedades
      </Link>
      <h1 className="m-0 mb-1 text-[22px] font-medium tracking-[-0.01em]">{property.title}</h1>
      <p className="m-0 mb-7 font-mono text-[12px] tracking-[0.08em] text-faint">{property.code}</p>

      <PropertyForm
        action={boundUpdate}
        property={property}
        insuranceProducts={insuranceProducts}
        role={session.role}
      />

      <PropertyImages propertyId={id} images={images} />
    </div>
  );
}
