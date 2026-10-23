/**
 * Generador unificado de enlaces directos a WhatsApp Web.
 * Sanitiza números telefónicos con foco en la numeración de Argentina y formato internacional E.164.
 */

/**
 * Sanitiza y estandariza un número telefónico para la API de WhatsApp.
 */
export function sanitizeWhatsAppPhone(phone?: string | null): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, '');
  if (digits.length < 8) return null;

  // Remueve cero inicial (ej. 011 -> 11)
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // Remueve '15' si está después de código de área '11' (ej. 111555550000 -> 1155550000)
  if (digits.startsWith('1115') && digits.length === 12) {
    digits = `11${digits.substring(4)}`;
  }

  // Remueve prefijo '15' directo de celular (ej. 1544445555 -> 44445555)
  if (digits.length === 10 && digits.startsWith('15')) {
    digits = digits.substring(2);
  }

  // Agrega código de país Argentina (549) si no lo tiene
  if (!digits.startsWith('549') && !digits.startsWith('54')) {
    digits = `549${digits}`;
  } else if (digits.startsWith('54') && !digits.startsWith('549')) {
    digits = `549${digits.substring(2)}`;
  }

  return digits;
}

/**
 * Genera la URL de WhatsApp Web completa con texto predeterminado opcional.
 */
export function buildWhatsAppUrl(phone?: string | null, message?: string): string {
  const sanitized = sanitizeWhatsAppPhone(phone);
  if (!sanitized) return '';

  const encodedMessage = message ? encodeURIComponent(message) : '';
  return encodedMessage 
    ? `https://wa.me/${sanitized}?text=${encodedMessage}`
    : `https://wa.me/${sanitized}`;
}
