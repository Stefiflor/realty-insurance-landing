"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea, Checkbox, FormError } from "@/components/admin/FormControls";
import {
  LISTING_STATES,
  OPERATIONS,
  PROPERTY_KINDS,
  type InsuranceProduct,
  type Property,
} from "@/lib/domain/types";
import type { StaffRole } from "@/lib/auth/session";
import type { PropertyFormState } from "@/app/admin/(dashboard)/propiedades/actions";

const CURRENCIES = ["USD", "ARS"] as const;

const STATE_LABEL: Record<(typeof LISTING_STATES)[number], string> = {
  publicado: "Publicado (visible en la web)",
  revision: "En revisión",
  borrador: "Borrador",
  pausado: "Pausado",
};

const KIND_LABEL: Record<(typeof PROPERTY_KINDS)[number], string> = {
  casa: "Casa",
  departamento: "Departamento",
  ph: "PH",
  estudio: "Monoambiente",
  lote: "Lote",
  campo: "Campo",
  cabana: "Cabaña",
  local: "Local",
  oficina: "Oficina",
};

const OPERATION_LABEL: Record<(typeof OPERATIONS)[number], string> = {
  venta: "Venta",
  alquiler: "Alquiler",
  terreno: "Terreno",
  temporario: "Temporario",
};

type Action = (state: PropertyFormState, formData: FormData) => Promise<PropertyFormState>;

export function PropertyForm({
  action,
  property,
  insuranceProducts,
  role,
}: {
  action: Action;
  /** Si viene, el formulario edita; si no, crea. */
  property?: Property;
  insuranceProducts: InsuranceProduct[];
  role: StaffRole;
}) {
  const [state, formAction, pending] = useActionState<PropertyFormState, FormData>(action, {});
  const canPublish = role === "admin";

  return (
    <form action={formAction} className="max-w-[760px]">
      <FormError message={state.error} />

      <div className="mb-8 grid grid-cols-2 gap-5">
        <Field label="Código" htmlFor="code" hint="Único, ej. MD-1042">
          <Input id="code" name="code" defaultValue={property?.code} required />
        </Field>
        <Field label="Slug (URL)" htmlFor="slug" hint="Único, en minúsculas y con guiones">
          <Input id="slug" name="slug" defaultValue={property?.slug} required />
        </Field>
      </div>

      <Field label="Título" htmlFor="title" className="mb-5">
        <Input id="title" name="title" defaultValue={property?.title} required />
      </Field>

      <Field label="Descripción" htmlFor="description" className="mb-8">
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={property?.description}
        />
      </Field>

      <div className="mb-8 grid grid-cols-3 gap-5">
        <Field label="Operación" htmlFor="operation">
          <Select id="operation" name="operation" defaultValue={property?.operation} required>
            <option value="" disabled>
              Elegir...
            </option>
            {OPERATIONS.map((op) => (
              <option key={op} value={op}>
                {OPERATION_LABEL[op]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tipo" htmlFor="kind">
          <Select id="kind" name="kind" defaultValue={property?.kind} required>
            <option value="" disabled>
              Elegir...
            </option>
            {PROPERTY_KINDS.map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Estado" htmlFor="state">
          <Select id="state" name="state" defaultValue={property?.state ?? "borrador"} required>
            {LISTING_STATES.map((s) => (
              <option key={s} value={s} disabled={s === "publicado" && !canPublish}>
                {STATE_LABEL[s]}
              </option>
            ))}
          </Select>
          {!canPublish && (
            <div className="mt-1.5 text-[11.5px] font-light text-faint">
              Sólo un administrador puede publicar.
            </div>
          )}
        </Field>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-5">
        <Field label="Precio" htmlFor="priceAmount">
          <Input
            id="priceAmount"
            name="priceAmount"
            type="number"
            step="0.01"
            min="0"
            defaultValue={property?.price.amount}
            required
          />
        </Field>
        <Field label="Moneda" htmlFor="priceCurrency">
          <Select id="priceCurrency" name="priceCurrency" defaultValue={property?.price.currency ?? "USD"}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Período" htmlFor="pricePeriod">
          <Select id="pricePeriod" name="pricePeriod" defaultValue={property?.price.period ?? "unico"}>
            <option value="unico">Único (venta)</option>
            <option value="mes">Por mes</option>
            <option value="noche">Por noche</option>
          </Select>
        </Field>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-5">
        <Field label="Barrio" htmlFor="neighbourhood">
          <Input id="neighbourhood" name="neighbourhood" defaultValue={property?.location.neighbourhood} />
        </Field>
        <Field label="Ciudad" htmlFor="city">
          <Input id="city" name="city" defaultValue={property?.location.city} required />
        </Field>
        <Field label="Provincia" htmlFor="province">
          <Input id="province" name="province" defaultValue={property?.location.province} required />
        </Field>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-5">
        <Field label="Ambientes" htmlFor="rooms">
          <Input id="rooms" name="rooms" type="number" min="0" defaultValue={property?.facts.rooms} />
        </Field>
        <Field label="Dormitorios" htmlFor="bedrooms">
          <Input id="bedrooms" name="bedrooms" type="number" min="0" defaultValue={property?.facts.bedrooms} />
        </Field>
        <Field label="Baños" htmlFor="bathrooms">
          <Input id="bathrooms" name="bathrooms" type="number" min="0" defaultValue={property?.facts.bathrooms} />
        </Field>
        <Field label="Piso" htmlFor="floor">
          <Input id="floor" name="floor" type="number" defaultValue={property?.facts.floor} />
        </Field>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-5">
        <Field label="Superficie cubierta (m²)" htmlFor="coveredArea">
          <Input
            id="coveredArea"
            name="coveredArea"
            type="number"
            step="0.01"
            min="0"
            defaultValue={property?.facts.coveredArea}
          />
        </Field>
        <Field label="Superficie total" htmlFor="totalArea">
          <Input
            id="totalArea"
            name="totalArea"
            type="number"
            step="0.01"
            min="0"
            defaultValue={property?.facts.totalArea}
          />
        </Field>
        <Field label="Unidad" htmlFor="areaUnit">
          <Select id="areaUnit" name="areaUnit" defaultValue={property?.facts.areaUnit ?? ""}>
            <option value="">—</option>
            <option value="m2">m²</option>
            <option value="ha">Hectáreas</option>
          </Select>
        </Field>
      </div>

      <Field
        label="Características"
        htmlFor="highlights"
        hint="Separadas por coma: Pileta, Jardín, Hogar a leña"
        className="mb-8"
      >
        <Input
          id="highlights"
          name="highlights"
          defaultValue={property?.facts.highlights.join(", ")}
        />
      </Field>

      <Field label="Cobertura sugerida" htmlFor="insuranceProductId" className="mb-8">
        <Select
          id="insuranceProductId"
          name="insuranceProductId"
          defaultValue={
            insuranceProducts.find((p) => p.slug === property?.insuranceSlug)?.id ?? ""
          }
        >
          <option value="">Sin cobertura asignada</option>
          {insuranceProducts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </Field>

      <div className="mb-8 flex flex-wrap gap-8">
        <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-dim">
          <Checkbox name="hasParking" defaultChecked={property?.facts.hasParking} />
          Tiene cochera
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-dim">
          <Checkbox name="featured" defaultChecked={property?.featured} />
          Destacada en la home
        </label>
      </div>

      <Button type="submit" variant="primary" size="md" disabled={pending}>
        {pending ? "Guardando..." : property ? "Guardar cambios" : "Crear propiedad"}
      </Button>
    </form>
  );
}
