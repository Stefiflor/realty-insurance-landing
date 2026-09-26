"use client";

import { Button } from "./Button";
import { WhatsappGlyph } from "./Icon";
import { logEnquiry, whatsappLink } from "@/lib/domain/whatsapp";
import type { EnquiryIntent, Locale } from "@/lib/domain/types";

/**
 * Botón que abre WhatsApp con un mensaje ya escrito.
 *
 * Si todavía no hay número configurado renderiza un botón inerte en vez de un
 * enlace roto: se ve igual, pero no promete algo que no puede cumplir.
 *
 * Cuando se le pasa `intent`, el clic queda registrado en `enquiries` antes de
 * abrir el chat (ver `logEnquiry`). Es opcional porque no todos los usos
 * representan una consulta con intención clara.
 */
export function WhatsappButton({
  message,
  variant = "whatsapp",
  size = "md",
  className,
  children,
  intent,
  locale = "es",
  propertyId,
}: {
  /** Texto precargado en el chat. Armalo con las funciones de `domain/whatsapp`. */
  message: string;
  variant?: "whatsapp" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  intent?: EnquiryIntent;
  locale?: Locale;
  /** Propiedad desde la que sale la consulta, si corresponde. */
  propertyId?: string | null;
}) {
  const href = whatsappLink(message);

  function handleClick() {
    if (intent) logEnquiry(intent, locale, propertyId);
  }

  const content = (
    <>
      <WhatsappGlyph size={size === "lg" ? 18 : 15} className={variant === "whatsapp" ? undefined : "text-whatsapp"} />
      {children}
    </>
  );

  if (!href) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        {content}
      </Button>
    );
  }

  return (
    <Button
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {content}
    </Button>
  );
}
