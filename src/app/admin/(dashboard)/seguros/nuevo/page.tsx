import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { InsuranceForm } from "@/components/admin/InsuranceForm";
import { createInsuranceAction } from "../actions";

export const metadata = { title: "Nueva cobertura · Panel MD" };

export default function NewInsurancePage() {
  return (
    <div>
      <Link
        href="/admin/seguros"
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-dim hover:text-brand"
      >
        <Icon name="chevron-left" size={14} />
        Seguros
      </Link>
      <h1 className="m-0 mb-7 text-[22px] font-medium tracking-[-0.01em]">Nueva cobertura</h1>
      <InsuranceForm action={createInsuranceAction} />
    </div>
  );
}
