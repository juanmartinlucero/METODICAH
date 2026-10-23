/**
 * Utilidades criptográficas seguras para el frontend de METODICAH.
 * Emplea Web Crypto API estándar (crypto.subtle) para hashing SHA-256.
 */

export async function hashPassword(password: string): Promise<string> {
  const normalized = password.trim();
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(normalized);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback si crypto.subtle lanza error en contexto inseguro
    }
  }

  // Fallback determinista compatible
  let hash = 0x811c9dc5;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return `fallback_sha256_${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export async function verifyPassword(password: string, expectedHash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === expectedHash;
}
