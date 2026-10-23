# Arquitectura del Sistema — METODICAH

## 1. Filosofía de Diseño y Capas Arquitectónicas

**METODICAH** adopta una arquitectura modular orientada al dominio inspirada en los principios de **Clean / Hexagonal Architecture**, complementada por **Zustand Tier 3 (Optimistic UI en $0\text{ ms}$ + Sincronización Reactiva)** y **Google Cloud Firestore** con persistencia local nativa offline.

### Invariantes Estructurales de Diseño
1. **Aislamiento e Inmunidad de la Capa de Dominio:**
   - La lógica matemática de negocio (cálculo de carga horaria de grafos, validaciones CUIT/CUIL, ordenamiento temporal UTC-3) es **100% síncrona, pura y determinista**.
   - No contiene dependencias de `react`, `zustand`, `firebase/*` ni objetos globales de navegador (`window`, `localStorage`).
2. **Persistencia Directa sin Repositorio Dual ([ADR-001](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/docs/adr/ADR-001-eliminacion-repositorio-dual-y-optimistic-ui-firestore.md)):**
   - Se eliminaron las implementaciones locales redundantes (`LocalStorage*Repository`). Todas las entidades de negocio se persisten y sincronizan exclusivamente mediante repositorios de Firestore (`Firestore*Repository`).
   - `localStorage` se restringe de forma estricta al almacenamiento de preferencias cosméticas de interfaz de usuario (`STORAGE_KEYS`).
3. **Inicialización Limpia sin Fallbacks Mock ([ADR-002](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/docs/adr/ADR-002-inicializacion-limpia-y-desacople-de-fallbacks-mock.md)):**
   - Los repositorios y los stores arrancan en colecciones vacías (`[]` y `{}`). Si Cloud Firestore no tiene documentos creados, el sistema refleja de forma transparente el estado vacío real sin inyectar datos ficticios en la base de datos de producción.

```mermaid
flowchart TD
  subgraph Presentation["Capa de Presentación (React 19 + HUD Amber)"]
    Views["Vistas Lazy-Loaded (Events, Clients, Suppliers, Crew, Workflow, Settings)"]
    HUD["Componentes HUD Dark (Sidebar, RightSidebar, AnalyticsMetricCard)"]
    Modals["Sistema de Modales Accesibles (BaseModal, ConfirmModal, FocusTrap)"]
    Forms["Formularios Modulares (React Hook Form + FormProvider)"]
  end

  subgraph State["Capa de Estado Reactivo (Zustand Tier 3)"]
    Stores["Stores Reactivos (useEventsStore, useClientsStore, useCrewStore, etc.)"]
    OptimisticEngine["Motor Optimista (0ms Render + Rollback Automático)"]
    Listeners["Gestor de Suscripciones en Tiempo Real (onSnapshot)"]
  end

  subgraph Domain["Capa de Dominio y Contratos (TypeScript Puro)"]
    Contracts["Contratos de Repositorio (IEventsRepository, IClientsRepository, etc.)"]
    Schemas["Validación de Frontera Zod (eventFormSchema, workflowSchema)"]
    PureUtils["Utilidades Matemáticas (dateUtils UTC-3, CUIT Módulo 11, searchUtils NFD)"]
    Entities["Entidades de Dominio (EventItem, Client, Supplier, ProcessNode)"]
  end

  subgraph Infrastructure["Capa de Infraestructura (Firebase 12)"]
    FirestoreRepos["Implementaciones Firestore (FirestoreEventsRepository, etc.)"]
    Sanitizer["Sanitizador de Payloads (cleanFirestorePayload)"]
    BatchManager["Fragmentador de Lotes (commitBatchInChunks <= 450 ops)"]
    FirebaseCore[("Cloud Firestore + persistentLocalCache Multi-Tab")]
    FirebaseAuth["Firebase Authentication (RBAC Claims)"]
    FirebaseStorage["Cloud Storage (Documentación y Media)"]
    Analytics["Firebase Analytics (Fail-Silent + Anti-PII)"]
  end

  Views --> Stores
  Views --> HUD
  Views --> Modals
  Views --> Forms
  Forms --> Schemas
  Stores --> OptimisticEngine
  Stores --> Listeners
  Stores --> Contracts
  Contracts --> FirestoreRepos
  FirestoreRepos --> Sanitizer
  FirestoreRepos --> BatchManager
  FirestoreRepos --> PureUtils
  BatchManager --> FirebaseCore
  FirestoreRepos --> FirebaseCore
  Stores --> FirebaseAuth
  FirestoreRepos --> FirebaseStorage
  Views -.-> Analytics
```

---

## 2. Ciclo de Vida de Mutación Optimista y Sincronización en Tiempo Real

Toda operación de creación, actualización o eliminación disparada por el usuario opera en cuatro fases deterministas:

```mermaid
sequenceDiagram
  autonumber
  participant UI as Vista / Formulario HUD
  participant Store as Store Zustand (Tier 3)
  participant Repo as Repositorio Firestore
  participant Sanitizer as cleanFirestorePayload
  participant DB as Cloud Firestore (IndexedDB + Cloud)

  UI->>Store: Dispara acción (ej. createEvent, addClient, updateWorkflow)
  Note over Store: 1. Preservación de Snapshot Previo
  Store->>Store: Clona estado anterior (previousState)
  Note over Store: 2. Mutación Inmediata (0ms)
  Store->>Store: Aplica cambio en memoria y marca isSyncing = true
  Store-->>UI: Re-render instantáneo (Latencia cero percibida)
  
  Note over Store,Repo: 3. Persistencia Asíncrona en Segundo Plano
  Store->>Repo: Invoca método del repositorio (saveEvent, saveClient)
  Repo->>Sanitizer: Sanitiza payload (remueve undefined recursivamente)
  Sanitizer-->>Repo: Payload limpio y tipado
  Repo->>DB: setDoc / updateDoc / commitBatchInChunks (<= 450 ops)
  
  alt Persistencia Exitosa en la Nube
    DB-->>Repo: Confirmación de escritura (ACK)
    Repo-->>Store: Promesa resuelta satisfactoriamente
    Store->>Store: Marca isSyncing = false
    Store-->>UI: Estado de sincronización confirmado
  else Error de Red, Permisos o Validación Remota
    DB-->>Repo: Rechazo (permission-denied, unavailable, etc.)
    Repo->>Repo: Revierte estado interno en memoria
    Repo->>Repo: Traduce código técnico a español (formatFirebaseError)
    Repo-->>Store: Rechazo de promesa con error legible
    Note over Store: 4. Rollback Automático
    Store->>Store: Restaura previousState + expone error en el estado
    Store-->>UI: Reversión visual automática + Notificación Toast de error
  end
```

### Gestión de Listeners en Tiempo Real (`onSnapshot`)
1. **Encapsulamiento Fuera de Vistas:**
   Queda terminantemente prohibido instanciar `onSnapshot` directamente dentro del cuerpo de componentes visuales.
2. **Suscripción Gobernada por el Layout Central:**
   En [`AppLayout.tsx`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/layouts/AppLayout.tsx), las suscripciones (`subscribeEvents`, `subscribeClients`, etc.) se inicializan en un único `useEffect` raíz y devuelven su correspondiente función limpiadora `unsubscribe()`, evitando fugas de memoria o suscripciones fantasma al navegar.

---

## 3. Telemetría Privada, Ética y Fail-Silent (Regla Anti-PII)

En [`src/services/firebase.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/services/firebase.ts):
- **Verificación de Soporte:** Se consulta asíncronamente `await isSupported()` antes de inicializar Firebase Analytics. Si el navegador del usuario bloquea cookies de terceros o utiliza extensiones de bloqueo de rastreo (ad-blockers), la inicialización falla silenciosamente (*fail-silent*) sin interrumpir la experiencia de usuario.
- **Regla Estricta Anti-PII (Personally Identifiable Information):**
  La función utilitaria `trackEvent(eventName, params)` prohíbe el envío de nombres de personas, direcciones de correo electrónico, números de teléfono, CUIT/CUIL, importes económicos o domicilios. Únicamente se reportan contadores, categorías genéricas o identificadores opacos de sistema.

---

## 4. Estrategia de Bundling y Code-Splitting en Vite

Para asegurar una carga inicial de la aplicación inferior a $1.5\text{ segundos}$ en redes móviles de producción en campo:
- **Carga Diferida de Rutas (`React.lazy`):** Cada página principal (`EventsView`, `ClientsView`, `SuppliersView`, `CrewView`, `WorkflowView`, `SettingsView`, `EventDetailView`) se empaqueta en su propio chunk asíncrono.
- **Particionado Manual de Librerías Pesadas (`manualChunks`):**
  En [`vite.config.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/vite.config.ts):
  - `firebase-vendor`: `@firebase/app`, `@firebase/auth`, `@firebase/firestore`, `@firebase/storage`, `@firebase/analytics`.
  - `flow-vendor`: `@xyflow/react` (descargado única y exclusivamente al ingresar a `/workflow`).
  - `pdf-vendor`: `jspdf`, `html2canvas` (descargado bajo demanda cuando el usuario pulsa "Exportar PDF").
  - `ui`: `lucide-react`, `zustand`, `react-hook-form`, `zod`.

---

## 5. Pirámide de Testing y Quality Gates

La confiabilidad del software se valida mediante una batería automatizada con **20 archivos de suite y 171 tests unitarios e integrados** ejecutados sobre **Vitest 5 + jsdom**:
1. **Pruebas de Dominio y Utilidades Matemáticas:**
   - Algoritmo de validación CUIT/CUIL vía Módulo 11 ([`clientUtils.test.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/utils/clientUtils.ts)).
   - Invariante de fechas al mediodía local UTC-3 ([`dateUtils.test.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/utils/dateUtils.test.ts)).
   - Métricas y dependencias acíclicas en flujos DAG ([`workflowUtils.test.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/utils/workflowUtils.test.ts)).
2. **Pruebas de Repositorios y Sanitización:**
   - Sanitización estricta de campos `undefined` antes de persistir en Cloud Firestore ([`repositories.test.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/services/repositories/repositories.test.ts)).
   - Fragmentación en lotes $\le 450$ operaciones y borrado atómico en cascada ([`firestoreBatchUtils.test.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/services/repositories/firebase/firestoreBatchUtils.test.ts)).
3. **Pruebas de Stores Zustand (Tier 3 Optimistic & Rollback):**
   - Comprobación de aplicación inmediata en $0\text{ ms}$ y reversión exacta a estado anterior ante excepciones simuladas de backend ([`stores.test.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/stores/stores.test.ts)).
4. **Pruebas de Integración y Ruteo:**
   - Conmutación libre de oscilaciones entre flujos de trabajo ([`workflow.test.tsx`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/components/workflow/workflow.test.tsx)).
   - Protección de rutas privadas y vistas de contingencia 404 ([`routes.test.tsx`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/routes.test.tsx)).
