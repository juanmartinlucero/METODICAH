# ADR-003: Módulo de Acreditaciones de Producción, Trazabilidad en Vivo y Control de Acceso

- **Estado:** Aceptado e Implementado
- **Fecha:** 2026-10-26
- **Contexto del Proyecto:** METODICAH

---

## 1. Contexto y Problema

En espectáculos en vivo masivos, festivales y eventos corporativos de gran escala, el control y la acreditación del personal técnico, proveedores y comitiva comitente/prensa constituyen un área operativa crítica por motivos de seguridad perimetral, legalidad laboral y control de aforos:
1. **Falta de Trazabilidad en Puerta:** Los coordinadores de producción solían depender de planillas de papel estáticas o mensajes desarticulados, sin posibilidad de conocer en tiempo real cuántos técnicos están físicamente presentes dentro del predio (*Live Headcount*).
2. **Riesgo Legal y de Seguros (ART):** El ingreso de personal técnico a zonas de alto riesgo (escenario, rigging, fosos técnicos) sin verificación previa de póliza de accidentes de trabajo con cláusula de no repetición expone a la productora a sanciones y responsabilidades civiles.
3. **Control de Zonas Restringidas:** La proliferación desordenada de accesos requería una categorización visual clara, estandarizada e inconfundible para el personal de seguridad en accesos.
4. **Exportaciones y Comunicación con Fuerzas de Seguridad / Proveedores:** Necesidad de emitir rápidamente planillas de control para firmas en portería (PDF apaisado oficial) y planillas de cálculo (Excel `.xlsx`) para liquidaciones y auditorías.

---

## 2. Opciones Consideradas

### 2.1 Modelo de Categorización de Accesos
- **Opción A (Niveles Dinámicos Ilimitados por Texto Libre):** Permitir crear cualquier cantidad de zonas personalizadas.
  - *Desventaja:* Diluye el estándar operativo, confunde a los controles de seguridad en puerta y dificulta la señalética cromática estandarizada en pases físicos.
- **Opción B (3 Categorías Exclusivas de Acceso: `ALL ACCESS`, `STAFF`, `GUEST`):**
  - Estandarización estricta de la industria:
    1. `ALL ACCESS` (Ámbar / Oro `#f59e0b`): Acceso total e irrestricto a escenario, backstage y oficinas técnicas.
    2. `STAFF` (Esmeralda `#10b981`): Personal técnico de montaje, operadores de consolas, riggers y proveedores de equipamiento.
    3. `GUEST` (Cielo `#0284c7`): Invitados especiales, comitentes de marca y periodistas autorizados.
  - *Ventaja:* Claridad visual instantánea para el personal de seguridad a distancia y señalética infalible.

### 2.2 Generación y Renderizado de Códigos QR para Credenciales
- **Opción A (Librería Externa con Canvas / Img en Tiempo de Ejecución):**
  - *Desventaja:* Suma dependencias pesadas de terceros, posibles bloqueos de CORS o distorsión de píxeles al imprimir en hojas grandes.
- **Opción B (Generador Determinista de Matriz en TypeScript Puro + Renderizado Vectorial SVG):**
  - *Ventaja:* Cero dependencias adicionales en tiempo de ejecución, matriz 25x25 determinista, vectores SVG ultra-nítidos a cualquier resolución para impresión en credenciales tipo Lanyard.

### 2.3 Persistencia y Borrado en Cascada en Cloud Firestore
- **Opción A (Subcolección `/events/{eventId}/accreditations/{accId}`):**
  - Requiere queries adicionales de colección compuesta y borrado manual iterativo documento por documento al eliminar el evento.
- **Opción B (Documento Agregado `/accreditations/{eventId}` con Array Atómico):**
  - Consistente con el patrón implementado en `/timings/{eventId}` y `/process_nodes/{eventId}`. Permite lectura atómica $O(1)$ de la nómina completa en 1 solo read de Firestore y borrado en cascada en lote (`commitBatchInChunks`).

### 2.4 Exportación a Excel y Particionado de Bundles en Vite
- **Opción A (Exportación únicamente en formato CSV con BOM UTF-8):**
  - Liviano, pero no genera la extensión `.xlsx` nativa demandada habitualmente por auditorías corporativas.
- **Opción B (Instalación de `xlsx` con Code-Splitting Estricto `xlsx-vendor` y Carga Dinámica):**
  - Se aísla `xlsx` en un chunk independiente de Vite (`manualChunks`) y se importa dinámicamente (`const XLSX = await import('xlsx')`). Cero impacto en el bundle inicial de la plataforma.

---

## 3. Decisión Adoptada

Se adoptó la combinación de:
1. **3 Categorías Exclusivas de Acceso:** `ALL ACCESS`, `STAFF` y `GUEST` tipadas en TypeScript puro con colores de alto contraste HUD Studio Amber Dark.
2. **Persistencia Agregada Atómica en Firestore:** Colección `/accreditations/{eventId}` gestionada con Tier 3 Optimistic UI en Zustand (`accreditationsMap`) y borrado en cascada obligatorio de 4 documentos atómicos en [`FirestoreEventsRepository.deleteEvent`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/services/repositories/firebase/FirestoreEventsRepository.ts).
3. **Generador Vectorial SVG Nativo:** Código QR vectorizado en SVG puro para credenciales imprimibles estilo Lanyard.
4. **Terminal de Check-In en Puerta + Trazabilidad en Tiempo Real:** Modal optimizado para pistolas lectoras de código de barras o búsqueda instantánea por DNI para registrar el ingreso/egreso en $0\text{ ms}$ con marcas temporales exactas (`checkInAt`, `checkInBy`).
5. **Code-Splitting de Exportación Dual:** Chunks dedicados `pdf-vendor` (`jspdf`) y `xlsx-vendor` (`xlsx`) cargados exclusivamente bajo demanda.

---

## 4. Consecuencias

### Positivas
- **Control Perimetral Seguro y Trazabilidad:** El director técnico y el jefe de seguridad conocen en tiempo real el Headcount exacto (% de acreditados dentro del predio) y alertas inmediatas si ingresa personal sin ART verificada.
- **Performance a 60fps y Cero Impacto en Bundle:** La inclusión de `xlsx` y `jspdf` no aumentó en un solo byte el bundle principal de la aplicación (`index.js`).
- **Exportación Versátil:** El usuario cuenta con la planilla tabular formal en PDF para firmas en puerta y la nómina completa en Excel `.xlsx`.
- **Experiencia de Entrada Masiva:** El importador CSV/Excel procesa nóminas de decenas de técnicos enviadas por proveedores en segundos con filtro de duplicados.

### Negativas / Mitigaciones
- **Tamaño del Documento Agregado en Firestore:** Un array de acreditaciones en un solo documento tiene un límite teórico de 1 MB (~1500 a 2000 acreditados por evento). Como salvaguarda para producciones masivas de estadios que superen esa cifra, el [Roadmap de Escalabilidad](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/docs/roadmap/SCALABILITY_ROADMAP.md) contempla la migración automática a subcolecciones con paginación cursorizada cuando la nómina supere los 1000 registros.
