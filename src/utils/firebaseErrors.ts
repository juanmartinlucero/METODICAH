/**
 * Tipo discriminado Result<T, E> para manejo funcional de errores en infraestructura y dominio.
 */
export type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data });
export const err = <E = string>(error: E): Result<never, E> => ({ ok: false, error });

const FIREBASE_ERROR_MAP: Record<string, string> = {
  'auth/invalid-email': 'El formato del correo electrónico no es válido.',
  'auth/user-disabled': 'Esta cuenta de usuario ha sido deshabilitada.',
  'auth/user-not-found': 'Credenciales incorrectas. Verifica el correo y la contraseña.',
  'auth/wrong-password': 'Credenciales incorrectas. Verifica el correo y la contraseña.',
  'auth/invalid-credential': 'Credenciales incorrectas. Verifica el correo y la contraseña.',
  'auth/email-already-in-use': 'Este correo ya se encuentra registrado.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
  'auth/network-request-failed': 'Error de conexión de red. Verifica tu acceso a internet.',
  'permission-denied': 'No tienes permisos suficientes para realizar esta operación.',
  'not-found': 'El recurso solicitado no existe o fue eliminado.',
  'already-exists': 'El registro que intentas crear ya existe.',
  'unavailable': 'El servicio de base de datos no está disponible temporalmente.',
  'deadline-exceeded': 'La operación tardó demasiado tiempo. Intenta nuevamente.',
};

/**
 * Traduce códigos de error de Firebase Auth / Firestore a mensajes semánticos en español.
 */
export function formatFirebaseError(
  error: unknown,
  fallbackMessage = 'Ocurrió un error inesperado al procesar la solicitud.'
): string {
  if (!error) return fallbackMessage;

  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = String((error as { code?: unknown }).code);
    if (FIREBASE_ERROR_MAP[code]) {
      return FIREBASE_ERROR_MAP[code];
    }
  }

  if (error instanceof Error && error.message) {
    for (const [code, message] of Object.entries(FIREBASE_ERROR_MAP)) {
      if (error.message.includes(code)) {
        return message;
      }
    }
    return error.message;
  }

  return fallbackMessage;
}
