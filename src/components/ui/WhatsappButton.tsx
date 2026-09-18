import { Button } from "./Button";
import { WhatsappGlyph } from "./Icon";
import { whatsappLink } from "@/lib/domain/whatsapp";

/**
 * Botón que abre WhatsApp con un mensaje ya escrito.
 *
 * Si todavía no hay número configurado renderiza un botón inerte en vez de un
 * enlace roto: se ve igual, pero no promete algo que no puede cumplir.
 */
export function WhatsappButton({
  message,
  variant = "whatsapp",
  size = "md",
  className,
  children,
}: {
  /** Texto precargado en el chat. Armalo con las funciones de `domain/whatsapp`. */
  message: string;
  variant?: "whatsapp" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  const href = whatsappLink(message);

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
    >
      {content}
    </Button>
  );
}
