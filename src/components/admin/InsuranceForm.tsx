"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea, FormError } from "@/components/admin/FormControls";
import { INSURANCE_KINDS, type InsuranceProduct } from "@/lib/domain/types";
import type { InsuranceFormState } from "@/app/admin/(dashboard)/seguros/actions";

const KIND_LABEL: Record<(typeof INSURANCE_KINDS)[number], string> = {
  hogar: "Hogar",
  garantia: "Garantía de alquiler",
  responsabilidad: "Responsabilidad civil",
  construccion: "Obra y construcción",
};

type Action = (state: InsuranceFormState, formData: FormData) => Promise<InsuranceFormState>;

export function InsuranceForm({
  action,
  product,
}: {
  action: Action;
  product?: InsuranceProduct;
}) {
  const [state, formAction, pending] = useActionState<InsuranceFormState, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-[640px]">
      <FormError message={state.error} />

      <div className="mb-5 grid grid-cols-2 gap-5">
        <Field label="Nombre" htmlFor="name">
          <Input id="name" name="name" defaultValue={product?.name} required />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="Único, en minúsculas y con guiones">
          <Input id="slug" name="slug" defaultValue={product?.slug} required />
        </Field>
      </div>

      <Field label="Familia" htmlFor="kind" className="mb-5">
        <Select id="kind" name="kind" defaultValue={product?.kind} required>
          <option value="" disabled>
            Elegir...
          </option>
          {INSURANCE_KINDS.map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Descripción" htmlFor="description" className="mb-5">
        <Textarea id="description" name="description" rows={3} defaultValue={product?.description} required />
      </Field>

      <div className="mb-5 grid grid-cols-2 gap-5">
        <Field
          label="Detalle"
          htmlFor="detail"
          hint='Línea corta en versalitas, ej. "APROBACIÓN EN 48 H"'
        >
          <Input id="detail" name="detail" defaultValue={product?.detail} required />
        </Field>
        <Field label="Orden" htmlFor="position" hint="Menor número aparece primero">
          <Input
            id="position"
            name="position"
            type="number"
            min="0"
            defaultValue={product?.position ?? 0}
          />
        </Field>
      </div>

      <Field
        label="Aseguradoras"
        htmlFor="carriers"
        hint="Separadas por coma"
        className="mb-7"
      >
        <Input id="carriers" name="carriers" defaultValue={product?.carriers.join(", ")} />
      </Field>

      <Button type="submit" variant="primary" size="md" disabled={pending}>
        {pending ? "Guardando..." : product ? "Guardar cambios" : "Crear cobertura"}
      </Button>
    </form>
  );
}
