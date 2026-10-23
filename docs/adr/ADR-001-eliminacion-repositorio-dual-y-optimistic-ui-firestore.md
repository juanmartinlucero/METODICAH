# ADR-001: Eliminación del Repositorio Dual (`LocalStorage` + `Firestore` Proxy) y Adopción de Firestore Offline-First con Optimistic UI (Tier 3)

- **Estado:** Aceptado e Implementado
- **Fecha:** 2026-10-22

---

## Contexto

Originalmente, `METODICAH` implementaba un contenedor de repositorios dual en [`src/services/repositories/index.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/services/repositories/index.ts) basado en `createLazyRepository` y `VITE_STORAGE_PROVIDER` (`'local' | 'firebase'`), manteniendo 7 implementaciones duplicadas en `src/services/repositories/local/LocalStorage*Repository.ts` y 7 en `src/services/repositories/firebase/Firestore*Repository.ts`.

Además, los repositorios de Firestore contenían bloques `catch { // Offline fallback }` vacíos que silenciaban cualquier rechazo de escritura, impidiendo que los bloques `.catch(...)` de reversión (*rollback*) en los stores de Zustand se ejecutaran ante fallos reales de permisos o validación.

---

## Decisión

1. **Eliminar por completo la capa `LocalStorage*Repository` y el Proxy `createLazyRepository`:**
   Toda la persistencia de entidades de dominio se unifica exclusivamente sobre los repositorios de Cloud Firestore (`Firestore*Repository` y `FirebaseAuthRepository`). `localStorage` se reserva únicamente para preferencias efímeras de interfaz (ordenamiento, modo de vista, colapso de barras laterales y formato de fecha).
2. **Habilitar Caché Offline Nativo Multi-Pestaña en Firestore:**
   En [`src/services/firebase.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/services/firebase.ts), se inicializa Firestore con `persistentLocalCache({ tabManager: persistentMultipleTabManager() })`, delegando el soporte offline y la sincronización entre pestañas al motor nativo de IndexedDB del SDK de Firebase.
3. **Propagación de Errores Traducidos y Rollback Efectivo (Tier 3):**
   Los métodos de escritura de `Firestore*Repository` sanitizan los payloads con [`cleanFirestorePayload`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/utils/cleanFirestorePayload.ts) y, ante un rechazo de Firestore, revierten su estado en memoria y relanzan el error traducido mediante [`formatFirebaseError`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/utils/firebaseErrors.ts) para que los stores de Zustand ejecuten el *rollback* del estado optimista.

---

## Consecuencias

- **Positivas:**
  - Eliminación de código duplicado (7 adaptadores `LocalStorage*Repository` eliminados) y fin de las discrepancias de comportamiento entre entornos local y cloud.
  - El mecanismo de *Optimistic UI Rollback* funciona de extremo a extremo ante errores de permisos o red.
  - Sincronización reactiva en tiempo real (`onSnapshot`) encapsulada en los stores de Zustand.
- **Negativas / Trade-offs:**
  - Los tests unitarios en `jsdom` requieren un mock global determinista del SDK de Firebase en [`src/test/setup.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/test/setup.ts) para ejecutarse sin tráfico de red.
