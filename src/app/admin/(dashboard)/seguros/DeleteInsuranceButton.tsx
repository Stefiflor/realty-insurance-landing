"use client";

import { useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { deleteInsuranceAction } from "./actions";

export function DeleteInsuranceButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`¿Borrar "${name}"? Las propiedades que la tenían asignada quedan sin cobertura.`)) {
          return;
        }
        startTransition(() => deleteInsuranceAction(id));
      }}
      className="cursor-pointer text-dim hover:text-(--state-paused-fg) disabled:opacity-50"
      aria-label="Borrar"
    >
      <Icon name="trash" size={16} />
    </button>
  );
}
