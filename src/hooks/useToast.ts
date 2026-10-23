import { useContext } from 'react';
import { ToastContext, type ToastContextValue } from '../context/toastContextDef';

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: () => {},
      removeToast: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {}
    };
  }
  return context;
}

export type { ToastType, ToastItem, ToastContextValue } from '../context/toastContextDef';
