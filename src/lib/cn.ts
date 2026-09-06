/**
 * Une clases descartando lo falsy, para escribir condicionales sin ruido:
 *
 *   cn("btn", active && "btn-on", size === "lg" && "px-8")
 *
 * No hace merge de utilidades en conflicto (no es `tailwind-merge`): si dos
 * clases pelean, gana la que Tailwind ordene. Mantené las variantes
 * mutuamente excluyentes y no hace falta más.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
