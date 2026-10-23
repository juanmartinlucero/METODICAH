# Contexto Arquitectónico del Proyecto: METODICAH (`metodicah`)

Este workspace hereda las reglas globales de ingeniería (`~/.gemini/config/AGENTS.md`) y activa la siguiente configuración específica de arquitectura y dominio:

## 1. Perfil de Skills y Patrones Activos
- **Arquitectura Base:** Skill `hexagonal-react-firebase` (React 19 + TypeScript + Vite + Tailwind CSS v4 + React Hook Form + Zod + Firebase).
  - **Persistencia Directa en Firestore:** Los módulos nuevos o refactorizados deben implementar su persistencia directamente contra Firestore (`firestore-*.repository.ts`) aprovechando el caché offline nativo del SDK (`persistentLocalCache`). **No utilices ni extiendas el patrón de Repositorio Dual (`LocalStorage` + `Firestore` Proxy).**
- **Sincronización Reactiva:** Skill `zustand-realtime-sync` — **Tier 3 (Optimistic UI en `0ms` con Rollback Automático)**:
  - Las mutaciones actualizan el estado de Zustand de forma inmediata (`0ms`) marcando `isSyncing: true`, persisten en Firestore en segundo plano y revierten automáticamente al snapshot previo (`previous`) si la operación falla.
- **Sistema Visual y CRUD:** Skill `ui-system-and-crud` — **Preset 2 (HUD Studio Amber Dark)**:
  - Superficie profunda `#080b11` (`--bg-dark`) con acentos `--accent-amber` (`#f59e0b`), `--accent-emerald` (`#10b981`) y `--accent-rose` (`#f43f5e`).
  - Layout de 3 paneles en escritorio: `Sidebar` (navegación), `Main Workspace` (listado CRUD gobernado por `useEntityList` y `usePagination`) y `RightSidebar` (panel analítico en vivo de costos, márgenes y alertas).

## 2. Invariantes de Dominio Específicos (Operaciones, Recetas, Costos y Finanzas)
- **Exactitud Financiera y de Costos:** Toda fórmula de costo unitario, merma, margen bruto, punto de equilibrio o rentabilidad debe vivir como función pura en `domain/`, redondear decimales explícitamente (`toFixed(2)`) y proteger toda división contra denominadores `<= 0` o `NaN`.
- **Formularios Modulares Complejos:** Utiliza `<FormProvider>` dividiendo los formularios extensos en subcomponentes de sección (`*Fields.tsx`) y aplicando validaciones cruzadas de negocio mediante `.superRefine()` en los esquemas Zod.
- **Operaciones en Lote (`writeBatch`):** Para sincronizaciones o actualizaciones masivas de insumos/catálogos, fragmenta los lotes en chunks de máximo `450` operaciones.
