/**
 * Utilidades genéricas y tipadas para exportación y manipulación de archivos CSV.
 * Cumple con el estándar RFC 4180 y agrega BOM UTF-8 (\uFEFF) para compatibilidad nativa con Excel.
 */

export interface CSVColumn<T> {
  header: string;
  accessor: (item: T) => string | number | boolean | null | undefined;
}

/**
 * Escapa un campo individual según la especificación RFC 4180.
 * Si contiene comillas dobles, saltos de línea o comas, se envuelve en comillas y se duplican las comillas internas.
 */
export function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Parsea una línea de texto CSV respetando comillas y delimitadores según RFC 4180.
 */
export function parseCSVLine(line: string, customDelimiter?: string): string[] {
  const delimiter = customDelimiter || (line.includes(';') ? ';' : ',');
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parsea un documento CSV completo en filas y columnas respetando RFC 4180.
 */
export function parseCSVRecords(csvText: string): string[][] {
  const clean = csvText.replace(/^\uFEFF/, '').trim();
  if (!clean) return [];

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  const firstLine = clean.split(/\r?\n/)[0] || '';
  const delimiter = firstLine.includes(';') ? ';' : ',';

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (char === '"') {
      if (inQuotes && clean[i + 1] === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && clean[i + 1] === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      currentField = '';
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  currentRow.push(currentField.trim());
  if (currentRow.some(c => c.length > 0)) {
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Genera el string CSV a partir de un arreglo de entidades y su definición de columnas.
 */
export function generateCSVContent<T>(data: T[], columns: CSVColumn<T>[]): string {
  const headerRow = columns.map(c => escapeCSVField(c.header)).join(',');
  const dataRows = data.map(item => 
    columns.map(col => escapeCSVField(col.accessor(item))).join(',')
  );

  return [headerRow, ...dataRows].join('\r\n');
}

/**
 * Dispara la descarga en el navegador del archivo CSV con codificación UTF-8 con BOM.
 */
export function exportToCSV<T>(
  data: T[], 
  columns: CSVColumn<T>[], 
  filename: string
): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const csvContent = generateCSVContent(data, columns);
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
