# ADR-002: Inicialización Limpia (Clean Slate) y Desacople de Fallbacks Mock en Repositorios y Stores

- **Estado:** Aceptado e Implementado
- **Fecha:** 2026-10-22
- **Contexto del Proyecto:** METODICAH

---

## 1. Contexto y Problema

Tras la eliminación de la capa dual de repositorios en [ADR-001](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/docs/adr/ADR-001-eliminacion-repositorio-dual-y-optimistic-ui-firestore.md), la persistencia quedó unificada directamente sobre Cloud Firestore. Sin embargo, persistía en el código un mecanismo residual de soporte inicial:
1. Las clases repositorio (`FirestoreClientsRepository`, `FirestoreEventsRepository`, `FirestoreCrewRepository`, `FirestoreSuppliersRepository` y `FirestoreWorkflowRepository`) inicializaban sus variables privadas en memoria con colecciones completas de prueba importadas desde [`src/services/mockData.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/services/mockData.ts) (`INITIAL_EVENTS`, `INITIAL_CLIENTS`, etc.).
2. En las lecturas (`getClients`, `getEvents`, etc.) y suscripciones en tiempo real (`onSnapshot`), si la colección remota en Cloud Firestore estaba vacía (`snapshot.empty === true`), el repositorio activaba un fallback devolviendo los datos de prueba en lugar de un array vacío.
3. Los stores reactivos de Zustand (`useEventsStore`, `useClientsStore`, `useCrewStore`, `useSuppliersStore`, `useWorkflowStore`) también inicializaban sus estados en memoria con dichos mocks para optimizar el primer render a $0\text{ ms}$.

Esto provocaba que, al conectar un proyecto real y virgen de Firebase (`metodicah-19be9`) con 0 documentos en la nube, el usuario continuara visualizando datos de prueba ficticios, generando incertidumbre sobre el origen y la persistencia de los datos.

---

## 2. Opciones Consideradas

1. **Opción A (Base Limpia desde Cero — Clean Slate):**
   - Inicializar repositorios y stores con colecciones vacías (`[]` y `{}`).
   - Si Firestore retorna `snapshot.empty === true`, emitir y retornar listas vacías, permitiendo que la interfaz renderice sus estados vacíos nativos (*EmptyState*).
   - Preservar únicamente las plantillas de configuración estructurales de sistema (`eventStages`, `rolePermissions`, `crewSectors`, `supplierCategories`).

2. **Opción B (Sembrado Inicial Automático — Seed to Firestore):**
   - Ejecutar una rutina de sembrado (*seed script*) que vuelque físicamente los datos mock en las colecciones de Firestore del usuario en el primer inicio de sesión.
   - **Desventaja:** Contamina la base de datos de producción del usuario con registros ficticios que luego deben ser depurados manualmente.

3. **Opción C (Modo Demo Condicional mediante Flag):**
   - Mantener los mocks activos únicamente si `VITE_DEMO_MODE=true` está presente en `.env`.
   - **Desventaja:** Introduce complejidad condicional y riesgo de fugas de datos de prueba en entornos de despliegue.

---

## 3. Decisión Adoptada

Se adoptó la **Opción A (Base Limpia desde Cero)**:
1. **Desacople en Repositorios:**
   Las instancias `Firestore*Repository` declaran sus variables de estado iniciales en limpio (`inMemoryEvents = []`, `inMemoryClients = []`, etc.). Las lecturas contra colecciones vacías devuelven colecciones vacías de forma fidedigna.
2. **Desacople en Stores de Zustand:**
   Los stores arrancan con `events: []`, `clients: []`, `crewMembers: []`, `suppliers: []`, `workflows: []`, `timingsMap: {}`, `logs: []`, `processNodesMap: {}`.
3. **Limpieza en Vistas y Modales:**
   Se eliminaron las referencias a `INITIAL_CREW_MEMBERS` como valor de respaldo en [`NewEventModal.tsx`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/components/NewEventModal.tsx) y [`EventDetailView.tsx`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/views/EventDetailView.tsx).
4. **Preservación de Configuraciones Estructurales:**
   Se mantuvieron intactas las configuraciones del sistema en [`FirestoreSettingsRepository`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/services/repositories/firebase/FirestoreSettingsRepository.ts) (`DEFAULT_EVENT_STAGES`, `DEFAULT_ROLE_PERMISSIONS`, etc.), esenciales para que el pipeline de eventos y los roles de usuario operen sin requerir un paso manual previo de parametrización.

---

## 4. Consecuencias

### Positivas
- **Certeza Operativa Total:** El usuario sabe con absoluta precisión que lo que ve en pantalla proviene exclusivamente de su base de datos de Cloud Firestore.
- **Activación de Estados Vacíos Intuitivos:** La UI aprovecha los componentes de estado vacío (*"No hay clientes registrados"*, *"No se encontraron producciones"*) guiando al usuario a crear sus primeros registros reales.
- **Base de Datos Inmaculada:** Cero registros residuales o contaminantes en el proyecto Firebase de producción.

### Negativas / Mitigaciones
- **Aislamiento en Tests Automatizados:** Los tests unitarios que antes dependían implícitamente de datos mock globales pre-poblados ahora definen sus propios *fixtures* locales explícitos antes de ejecutar aserciones, fortaleciendo el determinismo de la suite de Vitest.
