import { useEffect } from "react";

declare global {
  interface Window {
    __revealFallback?: number | undefined;
  }
}

/**
 * Script de arranque: se ejecuta en el <head>, ANTES del primer pintado.
 * Marca <html class="reveal"> para que los elementos [data-reveal="scroll"] nazcan
 * ocultos y aparezcan al entrar en pantalla. Así no hay parpadeo: nunca se ven y
 * luego se ocultan.
 *
 * - Con "reducir movimiento" activado no hace nada y todo se ve normal.
 * - Si por algún motivo la app no carga (JS bloqueado o roto), a los 6 segundos
 *   se quita la clase y el contenido queda visible.
 */
export const revealBootScript = `(function(){var d=document.documentElement;if(!window.matchMedia||window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window))return;d.classList.add("reveal");window.__revealFallback=window.setTimeout(function(){d.classList.remove("reveal")},6000)})();`;

/**
 * Anima la entrada de los elementos marcados con data-reveal="scroll" cuando aparecen
 * en pantalla. Los marcados con data-reveal="load" (header y hero) se animan solo con
 * CSS al cargar, sin depender de JavaScript. El escalonado se resuelve en styles.css.
 */
export function useReveal() {
  useEffect(() => {
    window.clearTimeout(window.__revealFallback);

    const root = document.documentElement;
    // Si el script de arranque no preparó la página, no se oculta nada: todo queda visible.
    if (!root.classList.contains("reveal")) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function reveal(element: Element) {
      element.setAttribute("data-revealed", "");
      observer.unobserve(element);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0.08 },
    );

    document
      .querySelectorAll<HTMLElement>('[data-reveal="scroll"]:not([data-revealed])')
      .forEach((element) => observer.observe(element));

    // Quien navega con teclado puede llegar a un elemento todavía oculto: se muestra al enfocarlo.
    const onFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const pending = event.target.closest('[data-reveal="scroll"]:not([data-revealed])');
      if (pending) reveal(pending);
    };
    // Si la persona activa "reducir movimiento" mientras usa la página, se muestra todo.
    const onMotionChange = () => {
      if (motion.matches) root.classList.remove("reveal");
    };

    document.addEventListener("focusin", onFocusIn);
    motion.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", onFocusIn);
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);
}
