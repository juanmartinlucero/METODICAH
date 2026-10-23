# Manual de Despliegue y Runbook de Operaciones — METODICAH

## 1. Catálogo de Variables de Entorno (`.env`)

Las variables de entorno son leídas en tiempo de arranque y validadas estrictamente con **Zod** en [`src/config/env.config.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/config/env.config.ts):

| Variable | Requerida | Valor de Respaldo (Fallback) | Propósito Arquitectónico |
| :--- | :---: | :--- | :--- |
| `VITE_STORAGE_PROVIDER` | No | `'firebase'` | Define el proveedor de almacenamiento arquitectónico (documental). |
| `VITE_FIREBASE_API_KEY` | Sí | `'demo-api-key'` | Clave de API pública para inicializar la conexión con el SDK de Firebase. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Sí | `'metodicah-demo.firebaseapp.com'` | Dominio de autenticación para redirecciones y emisión de tokens JWT. |
| `VITE_FIREBASE_PROJECT_ID` | Sí | `'metodicah-demo'` | Identificador canónico del proyecto en Google Cloud / Firebase (`metodicah-19be9`). |
| `VITE_FIREBASE_STORAGE_BUCKET`| Sí | `'metodicah-demo.appspot.com'` | Bucket de almacenamiento para planos, documentos y fotografías técnicas. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`| Sí | `'123456789'` | Sender ID de mensajería en la nube de Google. |
| `VITE_FIREBASE_APP_ID` | Sí | `'1:123456789:web:demo'` | Identificador de registro de la aplicación Web en la consola. |
| `VITE_FIREBASE_MEASUREMENT_ID` | No | `undefined` | ID de medición para Google Analytics 4 (`G-XXXXXXXXXX`). Si se omite, la telemetría se apaga limpiamente. |

---

## 2. Pipeline de Verificación Pre-Despliegue (Quality Gates)

Antes de fusionar cambios a la rama principal (`main`) o compilar para producción, es obligatorio ejecutar en orden la secuencia de verificación continua:

```bash
# 1. Linter estático y análisis de reglas de hooks (Oxlint)
npm run lint

# 2. Ejecución completa de las 20 suites de pruebas unitarias e integración (171 tests)
npm run test:run

# 3. Verificación de tipos de TypeScript (tsc -b) y compilación optimizada en Vite
npm run build
```

> [!IMPORTANT]
> Ningún despliegue a producción debe realizarse si alguno de los tres comandos finaliza con código de error distinto de 0.

---

## 3. Comandos de Despliegue en Firebase

El proyecto cuenta con vinculación local mediante [`.firebaserc`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/.firebaserc) apuntando al proyecto activo `metodicah-19be9`.

### 3.1 Despliegue de Reglas de Seguridad (Sin modificar la aplicación web)
```bash
# Desplegar reglas de Cloud Firestore y Cloud Storage
npx firebase deploy --only firestore:rules,storage
```

### 3.2 Despliegue de la Aplicación Web (Hosting)
```bash
# 1. Compilar el bundle estático en la carpeta dist/
npm run build

# 2. Desplegar los artefactos optimizados a Firebase Hosting
npx firebase deploy --only hosting
```

### 3.3 Despliegue Completo de Infraestructura y Frontend
```bash
npm run build && npx firebase deploy
```

---

## 4. Runbook de Contingencias y Operaciones en Vivo

### 4.1 Operación sin Conexión en Predio, Estadio o Festival
- **Comportamiento:** La aplicación implementa `persistentLocalCache` multi-pestaña en [`src/services/firebase.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/services/firebase.ts). Si el equipo de producción pierde señal 4G/5G en el predio, las consultas se resuelven contra la caché IndexedDB local y las escrituras se encolan automáticamente.
- **Acción:** No refrescar la pestaña del navegador con `Ctrl+F5` para no forzar recargas de red. Mantener la pestaña abierta; al reconectarse a Internet, el SDK de Firebase transmitirá todas las operaciones encoladas de forma transparente.

### 4.2 Rechazo de Escritura y Rollback Visual (Optimistic UI)
- **Síntoma:** El usuario realiza una modificación que aparece instantáneamente en pantalla, pero 1 segundo después desaparece o vuelve al valor previo y se muestra un mensaje de error.
- **Diagnóstico:** Se activó el mecanismo de *Tier 3 Rollback* debido a un rechazo de Cloud Firestore (típicamente `permission-denied` si el usuario tiene rol `guest` o si expiró la sesión de Firebase Auth).
- **Acción:** Verificar que el usuario tenga una sesión válida en `/login` y que su perfil en `/users/{uid}` cuente con `globalRole: 'admin'` o `'team_member'`.

### 4.3 Falla Silenciosa de Telemetría (Fail-Silent)
- **Comportamiento:** Si el navegador tiene extensiones de bloqueo de rastreo (uBlock Origin, Brave Shields, etc.) o navegación privada sin cookies de terceros, Firebase Analytics arroja un error en `getAnalytics()`.
- **Mitigación:** En [`src/services/firebase.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/services/firebase.ts) la inicialización comprueba `await isSupported()` y atrapa cualquier excepción en un bloque `.catch()`, garantizando que la aplicación continúe funcionando al 100% sin caídas en pantalla.

### 4.4 Primer Inicio de Sesión y Creación del Usuario Administrador
- **Procedimiento:**
  1. Habilitar el proveedor de correo y contraseña en **Firebase Console $\to$ Authentication $\to$ Sign-in method**.
  2. Ingresar a la URL local o pública de la app en `/register`.
  3. Completar el formulario de alta. El primer usuario registrado adquiere automáticamente el rol `'admin'` y se almacena en `/users/{uid}` según las reglas de [`FirebaseAuthRepository.ts`](file:///C:/Users/juanm/Desktop/Workspace/METODICAH/src/services/repositories/firebase/FirebaseAuthRepository.ts).
