import { WhatsappGlyph } from "@/components/ui/Icon";
import { intentMessage, whatsappLink } from "@/lib/domain/whatsapp";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Botón flotante de WhatsApp, siempre visible.
 *
 * Es el atajo al canal de contacto desde cualquier punto de la página. Si no
 * hay número configurado no se renderiza: mejor que no esté a que no funcione.
 */
export function WhatsappFab({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const href = whatsappLink(intentMessage("comprar", locale));

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.contact.waCta}
      className="fixed right-5 bottom-5 z-50 flex size-13 items-center justify-center rounded-full bg-whatsapp text-whatsapp-ink shadow-lg transition-transform duration-[450ms] ease-(--ease-pop) hover:scale-108 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-whatsapp sm:right-8.5 sm:bottom-8.5 sm:size-14.5"
    >
      <WhatsappGlyph size={24} className="sm:hidden" />
      <WhatsappGlyph size={27} className="hidden sm:block" />
    </a>
  );
}
