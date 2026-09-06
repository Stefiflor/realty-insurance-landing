"use client";

import { useEffect } from "react";

/**
 * Hace que las tarjetas con `card-glow` iluminen bajo el cursor.
 *
 * Escucha el movimiento del mouse una sola vez a nivel documento en lugar de
 * poner un handler por tarjeta, y escribe las coordenadas como variables CSS
 * (`--mx`, `--my`) para que el pintado quede del lado del compositor.
 *
 * No hace nada en dispositivos táctiles (no hay cursor que seguir) ni para
 * quien pidió menos movimiento.
 */
export function usePointerGlow() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    function handle(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const card = target.closest<HTMLElement>(".card-glow");
      if (!card) return;

      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    }

    document.addEventListener("mousemove", handle, { passive: true });
    return () => document.removeEventListener("mousemove", handle);
  }, []);
}
