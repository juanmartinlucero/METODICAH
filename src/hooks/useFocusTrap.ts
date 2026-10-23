import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export interface UseFocusTrapOptions {
  autoFocus?: boolean;
  returnFocus?: boolean;
}

/**
 * Hook de accesibilidad (A11y) que confina el foco del teclado (Tab / Shift+Tab)
 * dentro del elemento contenedor mientras esté activo (WAI-ARIA Dialog Modal Pattern).
 * Al desmontarse o desactivarse, restaura el foco al elemento que disparó la apertura.
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  isActive: boolean,
  options: UseFocusTrapOptions = {}
) {
  const { autoFocus = true, returnFocus = true } = options;
  const containerRef = useRef<T>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    if (typeof document === 'undefined') return;

    // Guardar el elemento previamente activo para restaurar foco al cerrar
    triggerElementRef.current = (document.activeElement as HTMLElement) || null;

    const container = containerRef.current;
    if (!container) return;

    const getFocusables = (): HTMLElement[] => {
      if (!container) return [];
      const elements = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      return elements.filter(el => {
        if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') {
          return false;
        }
        if (el.style.display === 'none' || el.style.visibility === 'hidden') {
          return false;
        }
        return true;
      });
    };

    if (autoFocus) {
      const timerId = window.setTimeout(() => {
        const focusables = getFocusables();
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          container.focus();
        }
      }, 10);

      return () => window.clearTimeout(timerId);
    }
  }, [isActive, autoFocus]);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const getFocusables = (): HTMLElement[] => {
      if (!container) return [];
      const elements = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      return elements.filter(el => {
        if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') {
          return false;
        }
        if (el.style.display === 'none' || el.style.visibility === 'hidden') {
          return false;
        }
        return true;
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusables = getFocusables();
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];
      const currentActive = document.activeElement;

      if (e.shiftKey) {
        // Shift + Tab: navegando hacia atrás
        if (currentActive === firstElement || !container.contains(currentActive)) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: navegando hacia adelante
        if (currentActive === lastElement || !container.contains(currentActive)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (returnFocus && triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
        const trigger = triggerElementRef.current;
        setTimeout(() => {
          trigger.focus();
        }, 10);
      }
    };
  }, [isActive, returnFocus]);

  return containerRef;
}
