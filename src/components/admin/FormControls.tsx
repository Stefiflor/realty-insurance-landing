import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Controles de formulario del panel. No son parte del design system público
 * (ese usa las pills de `SearchBar`/`FilterBar`, pensadas para filtros, no
 * para carga de datos densa) — son más simples a propósito.
 */

const FIELD_BASE = cn(
  "w-full rounded-[5px] border border-hair-strong bg-surface px-3.5 py-2.5 text-[14px] text-ink",
  "placeholder:text-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
);

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[12.5px] font-medium text-dim">
      {children}
    </label>
  );
}

export function Field({
  label,
  htmlFor,
  children,
  hint,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <div className="mt-1.5 text-[11.5px] font-light text-faint">{hint}</div>}
    </div>
  );
}

export function Input({ className, ...rest }: ComponentPropsWithoutRef<"input">) {
  return <input {...rest} className={cn(FIELD_BASE, className)} />;
}

export function Textarea({ className, ...rest }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea {...rest} className={cn(FIELD_BASE, "resize-y", className)} />;
}

export function Select({ className, ...rest }: ComponentPropsWithoutRef<"select">) {
  return <select {...rest} className={cn(FIELD_BASE, "cursor-pointer", className)} />;
}

export function Checkbox({ className, ...rest }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      type="checkbox"
      {...rest}
      className={cn("size-4.5 cursor-pointer accent-[var(--brand)]", className)}
    />
  );
}

/** Mensaje de error de un formulario completo (arriba del todo). */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mb-5 rounded-[5px] border border-(--state-paused-fg)/30 bg-(--state-paused-bg) px-4 py-3 text-[13.5px] text-(--state-paused-fg)">
      {message}
    </div>
  );
}
