# METODICAH — Plataforma SaaS de Gestión y Producción Técnica de Eventos

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9_Strict-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.17_SDK-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand_Tier_3-764ABC?style=flat)](https://github.com/pmndrs/zustand)
[![Tests](https://img.shields.io/badge/Tests-187_Passed-10B981?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Design](https://img.shields.io/badge/HUD_Design-Amber_Dark-F59E0B?style=flat)](https://tailwindcss.com/)

**METODICAH** es una plataforma SaaS de ingeniería y gestión integral diseñada bajo el sistema visual **HUD Studio Amber Dark** (`#080b11`) para productoras de espectáculos masivos, festivales, producciones corporativas BTL y despliegues técnicos en vivo. Centraliza el ciclo de vida completo de cada espectáculo: directorio maestro de producciones, cronogramas operativos al minuto (*Run of Show / Timings*), diagramas de camino crítico y dependencias técnicas (*Workflows DAG*), directorio de proveedores homologados, cuadrillas de personal técnico (*Crew*) y matriz de permisos por roles (RBAC).

---

## Capacidades Clave por Módulo Funcional

1. **Gestión de Producciones & Eventos (`/events`):**
   - Pipeline de 8 etapas operativas configurables (desde *Backlog* y *Scouting* hasta *Producción en Vivo* y *Cierre*).
   - Vista universal gobernada por `useEntityList`: filtros por etapa, agrupación por mes o etapa, ordenamiento temporal con persistencia en `localStorage` y alternancia de vista compacta/grilla.
   - Panel analítico en vivo (*RightSidebar*) con cálculo en tiempo real de eventos activos, etapas y métricas de carga operativa.

2. **Cronograma Operativo & Run of Show (`/events/:eventId/timing`):**
   - Desglose temporal de actividades con orden de ejecución, sector responsable, ventana horaria e indicador de estado interactivo (*Pendiente*, *En Progreso*, *Completado*, *Demorado*).
   - Generación y exportación de hojas de ruta en PDF bajo demanda con `jspdf`.
   - Bitácora inmutable de auditoría (`AuditLog`) que registra cada cambio de estado con marca temporal local de Argentina (`es-AR`).

3. **Flujos de Trabajo & Grafos de Dependencia (`/workflow`):**
   - Modelado visual interactivo basado en `@xyflow/react` para orquestar los hitos técnicos de montaje, riders técnicos, habilitaciones legales y pruebas de sonido.
   - Cálculo automático de carga horaria acumulada ($H_{\text{total}}$) y porcentaje de avance operativo ($P_{\text{avance}}$) con protección contra división por cero.
   - Sincronización bidireccional estable entre rutas de React Router y el selector de flujos activos.

4. **Directorio de Clientes & Proveedores (`/clients` & `/suppliers`):**
   - Validación algorítmica de identificación tributaria argentina (**CUIT / CUIL vía Módulo 11**).
   - Búsqueda multi-token tolerante a acentos y tildes mediante normalización canónica NFD.
   - Importación y exportación masiva vía archivos CSV con validación de frontera Zod.

5. **Personal Técnico & Roles RBAC (`/crew` & `/settings`):**
   - Gestión unificada de equipo técnico categorizado por sectores (Audio, Iluminación, Video, Escenario, Rigging, etc.) y modalidad (*Staff Interno* o *Freelance*).
   - Matriz declarativa de permisos por rol (`admin`, `team_member`, `guest`) con protección de acceso a nivel de interfaz y reglas de seguridad en backend.

6. **Acreditaciones de Producción & Trazabilidad (`/events/:eventId/accreditations`):**
   - Registro y control de credenciales bajo 3 categorías exclusivas: `ALL ACCESS` (Ámbar), `STAFF` (Esmeralda) y `GUEST` (Cielo).
   - Panel analítico Top HUD de control de aforos y Headcount en tiempo real (% y presentes físicos en predio).
   - Control de seguridad y cobertura de seguros laborales (ART) con advertencias visuales de personal sin póliza.
   - Check-in en 1 clic y terminal de control de accesos para portería con escáner de códigos QR y búsqueda rápida por DNI.
   - Pases visuales estilo Lanyard con código QR vectorial en SVG puro listos para imprimir.
   - Exportación dual de alta fidelidad: Planilla tabular de control en PDF (`jspdf`) y nómina estructurada en Excel (`.xlsx` vía `xlsx-vendor` cargado dinámicamente).
   - Importador masivo de nóminas CSV/Excel con detección automática de duplicados.

7. **Persistencia Directa & Offline-First (Cloud Firestore):**
   - Conexión directa a Google Cloud Firestore con soporte multi-pestaña e IndexedDB local (`persistentLocalCache` + `persistentMultipleTabManager`).
   - Inicialización limpia (*Clean Slate*): los repositorios y stores operan sin datos de prueba ficticios, reflejando fielmente la información en la nube.
   - Telemetría privada y *fail-silent* mediante Firebase Analytics (regla estricta Anti-PII).

---

## Stack Tecnológico

| Capa | Tecnología | Propósito Arquitectónico |
| :--- | :--- | :--- |
| **Runtime & Core** | React 19 + TypeScript 5.9 + Vite 8 | Base síncrona y reactiva con tipado estricto y bundling de alto desempeño. |
| **Estilos & HUD** | Tailwind CSS v4 + Variables CSS | Sistema visual de alta densidad HUD Studio Amber Dark con contraste AAA. |
| **Estado Reactivo** | Zustand 5 (Tier 3 Optimistic UI) | Mutación en $0\text{ ms}$, rollback automático ante fallos y listeners `onSnapshot`. |
| **Persistencia Cloud** | Cloud Firestore + Firebase Auth | Base de datos NoSQL documental con caché offline persistente y reglas declarativas. |
| **Storage & Media** | Firebase Cloud Storage | Almacenamiento seguro de activos, logos y documentación técnica adjunta. |
| **Telemetría** | Firebase Analytics (`isSupported`) | Monitoreo privado *fail-silent* sin exposición de datos de identificación personal (PII). |
| **Grafos Interactivos** | `@xyflow/react` 12 | Visualización y manipulación de nodos de proceso DAG (cargado bajo demanda). |
| **Formularios & Zod** | React Hook Form 7 + Zod 4 | Validación estricta en la frontera de entrada con esquemas fuertemente tipados. |
| **Documentos & Reportes** | `jspdf` + `html2canvas` + `xlsx` | Generación de PDF y hojas de cálculo Excel (.xlsx) con particionado dinámico en chunks. |
| **Testing & Calidad** | Vitest 5 + Testing Library + Oxlint | 23 suites automatizadas (187 pruebas unitarias y de integración) y linter ultra-rápido. |

---

## Estructura de Directorios

```text
METODICAH/
├── .agents/                 # Perfil de reglas y estándares de arquitectura del workspace
├── docs/                    # Suite documental de ingeniería Docs-as-Code
│   ├── adr/                 # Architecture Decision Records inmutables
│   │   ├── ADR-001-*.md    # Unificación de repositorios en Firestore + Optimistic UI
│   │   ├── ADR-002-*.md    # Inicialización limpia (Clean Slate) sin datos mock
│   │   └── ADR-003-*.md    # Módulo de acreditaciones, trazabilidad y exportaciones
│   ├── architecture/        # Capas de software, flujo reactivo y bundling
│   ├── database/            # Modelo de datos NoSQL, Mermaid ER y reglas de seguridad
│   ├── domain/              # Reglas de negocio, fórmulas LaTeX y máquinas de estado
│   ├── operations/          # Catálogo .env, runbook de incidentes y scripts de deploy
│   └── roadmap/             # Trade-offs del estado actual y evolución a V2
├── src/
│   ├── assets/              # Isologotipos y recursos gráficos estáticos
│   ├── components/          # Componentes visuales desacoplados por dominio
│   │   ├── auth/            # Formularios y alertas de autenticación
│   │   ├── clients/         # Fichas, tarjetas y listas de clientes
│   │   ├── common/          # ErrorBoundary, BaseModal, ConfirmModal, EmptyState
│   │   ├── crew/            # Fichas de staff técnico y asignaciones
│   │   ├── dashboard/       # Tarjetas KPI, buscador rápido y bienvenida
│   │   ├── event-detail/    # Pestañas de detalle, timing, auditoría y acreditaciones
│   │   │   └── accreditations/ # Tabla, Top HUD, pase QR, scanner y modales
│   │   ├── events/          # Formularios modulares, filtros y tarjetas de eventos
│   │   ├── right-sidebar/   # Panel analítico lateral en vivo
│   │   ├── settings/        # Configuración de etapas, sectores y matriz de roles
│   │   ├── sidebar/         # Barra de navegación principal y branding
│   │   ├── suppliers/       # Directorio de proveedores y rubros técnicos
│   │   ├── ui/              # Primitivas accesibles (Button, Input, Badge, Card, etc.)
│   │   └── workflow/        # Canvas DAG, cabecera de métricas y modales de hitos
│   ├── config/              # Validación de entorno Zod (env.config.ts)
│   ├── constants/           # Claves constantes y STORAGE_KEYS tipadas (as const)
│   ├── context/             # ToastContext y notificaciones no intrusivas
│   ├── hooks/               # useEntityList, usePagination, useDateFormat, useFocusTrap
│   ├── layouts/             # AppLayout y drawers móviles con exclusión mutua
│   ├── schemas/             # Esquemas de validación Zod reutilizables
│   ├── services/            # Servicios de infraestructura y repositorios
│   │   ├── firebase.ts      # Inicialización de Auth, DB, Storage y Analytics
│   │   └── repositories/    # Implementaciones Firestore y contratos TypeScript
│   ├── stores/              # Stores Zustand (events, clients, crew, suppliers, etc.)
│   ├── types/               # Tipos e interfaces globales del dominio (metodicah.ts)
│   ├── utils/               # Utilidades puras (fechas UTC-3, CUIT Módulo 11, cleanPayload)
│   └── views/               # Contenedores de página lazy-loaded
├── firebase.json            # Configuración de Firestore rules, Storage y Hosting
├── firestore.rules          # Reglas de seguridad declarativas de Cloud Firestore
├── storage.rules            # Reglas de seguridad para Google Cloud Storage
└── vite.config.ts           # Configuración de Vite con manualChunks y alias @/*
```

---

## Guía de Arranque Rápido (`< 5 minutos`)

### 1. Prerrequisitos
- **Node.js:** Versión `20.x` o superior (se recomienda Node 22 LTS).
- **NPM:** Versión `10.x` o superior.
- **Proyecto de Firebase:** Cuenta en [Firebase Console](https://console.firebase.google.com/) con **Authentication** (Email/Password), **Cloud Firestore** y **Cloud Storage** activados.

### 2. Configuración de Variables de Entorno
Copia la plantilla [`.env.example`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/.env.example) a `.env` en la raíz del proyecto y completa las credenciales de tu aplicación web:

```ini
VITE_STORAGE_PROVIDER=firebase
VITE_FIREBASE_API_KEY=tu-api-key-de-firebase
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Instalación y Scripts de Ejecución

```bash
# Instalar dependencias del proyecto
npm install

# Servidor de desarrollo local con Vite HMR (http://localhost:5173)
npm run dev

# Análisis estático ultra-rápido de código
npm run lint

# Ejecutar la suite completa de 171 tests unitarios y de integración
npm run test:run

# Compilar bundle de producción optimizado
npm run build

# Previsualizar el bundle compilado localmente
npm run preview
```

---

## Índice de Documentación Técnica Profunda (`/docs`)

| Documento | Área de Enfoque | Enlace Directo |
| :--- | :--- | :--- |
| **Arquitectura** | Capas de software, ciclo reactivo `onSnapshot`, bundling y telemetría. | [`docs/architecture/ARCHITECTURE.md`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/docs/architecture/ARCHITECTURE.md) |
| **Reglas de Negocio** | Lenguaje ubicuo, fórmulas LaTeX, máquina de estados y CUIT Módulo 11. | [`docs/domain/BUSINESS_RULES.md`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/docs/domain/BUSINESS_RULES.md) |
| **Esquema de Datos** | Diagrama Mermaid ER, diccionario NoSQL, borrado en cascada y reglas. | [`docs/database/DATABASE_SCHEMA.md`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/docs/database/DATABASE_SCHEMA.md) |
| **Despliegue & Runbook** | Catálogo `.env`, pipeline de release, contingencias offline y hosting. | [`docs/operations/DEPLOYMENT_AND_RUNBOOK.md`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/docs/operations/DEPLOYMENT_AND_RUNBOOK.md) |
| **Escalabilidad** | Análisis de trade-offs del estado actual y mapa evolutivo hacia V2. | [`docs/roadmap/SCALABILITY_ROADMAP.md`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/docs/roadmap/SCALABILITY_ROADMAP.md) |
| **ADR-001** | Eliminación de repositorio dual y adopción de Firestore Offline Tier 3. | [`docs/adr/ADR-001-*.md`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/docs/adr/ADR-001-eliminacion-repositorio-dual-y-optimistic-ui-firestore.md) |
| **ADR-002** | Inicialización limpia (Clean Slate) sin datos mock en repositorios/stores. | [`docs/adr/ADR-002-*.md`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/docs/adr/ADR-002-inicializacion-limpia-y-desacople-de-fallbacks-mock.md) |
