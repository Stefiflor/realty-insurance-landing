"use client";

import { useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { deletePropertyAction } from "./actions";

export function DeleteButton({ propertyId, title }: { propertyId: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`¿Borrar "${title}"? No se puede deshacer.`)) return;
        startTransition(() => deletePropertyAction(propertyId));
      }}
      className="cursor-pointer text-dim hover:text-(--state-paused-fg) disabled:opacity-50"
      aria-label="Borrar"
    >
      <Icon name="trash" size={16} />
    </button>
  );
}
