/**
 * Sanitiza recursivamente cualquier objeto o array antes de persistirlo en Firestore.
 * Elimina todas las propiedades con valor `undefined` (que causan rechazo en Firestore),
 * preservando `null`, instancias `Date`, arrays y sentinelas `FieldValue` (`serverTimestamp()`, `increment()`, etc.).
 */
export function cleanFirestorePayload<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return obj;
  }

  // Preservar sentinelas internos de Firebase FieldValue (serverTimestamp, increment, arrayUnion, etc.)
  if ('_methodName' in (obj as Record<string, unknown>)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .filter((item): item is NonNullable<typeof item> => item !== undefined)
      .map((item) => cleanFirestorePayload(item)) as unknown as T;
  }

  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value !== undefined) {
      cleaned[key] = cleanFirestorePayload(value);
    }
  }

  return cleaned as T;
}
