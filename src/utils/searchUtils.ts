/**
 * Normaliza una cadena de texto eliminando diacríticos/tildes (NFD) y convirtiendo a minúsculas.
 */
export function normalizeSearchText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Evalúa si un conjunto de campos de texto coincide con una consulta de búsqueda
 * tolerante a tildes y multi-token (todas las palabras buscadas deben aparecer en al menos un campo).
 */
export function matchesSearch(
  fields: Array<string | null | undefined>,
  query: string
): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  const normalizedHaystack = fields
    .map((field) => normalizeSearchText(field))
    .filter(Boolean)
    .join(' ');

  return tokens.every((token) => normalizedHaystack.includes(token));
}
