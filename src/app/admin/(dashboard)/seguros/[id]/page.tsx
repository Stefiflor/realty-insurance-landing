import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { InsuranceForm } from "@/components/admin/InsuranceForm";
import { getInsuranceForEdit } from "@/lib/db/admin";
import { updateInsuranceAction } from "../actions";

export const metadata = { title: "Editar cobertura · Panel MD" };

export default async function EditInsurancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getInsuranceForEdit(id);
  if (!product) notFound();

  const boundUpdate = updateInsuranceAction.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/seguros"
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-dim hover:text-brand"
      >
        <Icon name="chevron-left" size={14} />
        Seguros
      </Link>
      <h1 className="m-0 mb-7 text-[22px] font-medium tracking-[-0.01em]">{product.name}</h1>
      <InsuranceForm action={boundUpdate} product={product} />
    </div>
  );
}
