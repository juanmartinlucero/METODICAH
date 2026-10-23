import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics';
import { ENV } from '@/config/env.config';

const firebaseConfig = {
  apiKey: ENV.VITE_FIREBASE_API_KEY,
  authDomain: ENV.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: ENV.VITE_FIREBASE_PROJECT_ID,
  storageBucket: ENV.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.VITE_FIREBASE_APP_ID,
  measurementId: ENV.VITE_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

function createFirestoreInstance(): Firestore {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch {
    return getFirestore(app);
  }
}

export const db = createFirestoreInstance();
export const storage = getStorage(app);

// Telemetría Fail-Silent y Privada (Rule 5)
export let analytics: Analytics | null = null;

if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Fail-silent si el entorno bloquea la telemetría (adblockers / cookies deshabilitadas)
      analytics = null;
    });
}

/**
 * Registra eventos de telemetría de forma privada (Anti-PII) y fail-silent.
 * Prohibido enviar nombres, correos electrónicos, DNI, teléfonos o direcciones.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  try {
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  } catch {
    // Fail-silent
  }
}
