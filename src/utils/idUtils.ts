/**
 * Utilidades estándar para generación determinista y segura de UUIDs en METODICAH.
 * Emplea crypto.randomUUID() de la plataforma web moderna, con fallback RFC 4122 v4.
 */

export function generateId(prefix = ''): string {
  let uuid: string;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    uuid = crypto.randomUUID();
  } else {
    // Fallback RFC 4122 v4
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const cleanPrefix = prefix ? (prefix.endsWith('_') ? prefix : `${prefix}_`) : '';
  return `${cleanPrefix}${uuid}`;
}
