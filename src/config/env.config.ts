import { z } from 'zod';

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1).default('demo-api-key'),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1).default('metodicah-demo.firebaseapp.com'),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1).default('metodicah-demo'),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1).default('metodicah-demo.appspot.com'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1).default('123456789'),
  VITE_FIREBASE_APP_ID: z.string().min(1).default('1:123456789:web:demo'),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

function parseEnv(): EnvConfig {
  const rawEnv: Record<string, unknown> =
    typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
  const result = envSchema.safeParse({
    VITE_FIREBASE_API_KEY: rawEnv.VITE_FIREBASE_API_KEY || undefined,
    VITE_FIREBASE_AUTH_DOMAIN: rawEnv.VITE_FIREBASE_AUTH_DOMAIN || undefined,
    VITE_FIREBASE_PROJECT_ID: rawEnv.VITE_FIREBASE_PROJECT_ID || undefined,
    VITE_FIREBASE_STORAGE_BUCKET: rawEnv.VITE_FIREBASE_STORAGE_BUCKET || undefined,
    VITE_FIREBASE_MESSAGING_SENDER_ID: rawEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || undefined,
    VITE_FIREBASE_APP_ID: rawEnv.VITE_FIREBASE_APP_ID || undefined,
    VITE_FIREBASE_MEASUREMENT_ID: rawEnv.VITE_FIREBASE_MEASUREMENT_ID || undefined,
  });

  if (!result.success) {
    console.warn('[env.config] Configuración de entorno incompleta, aplicando valores de respaldo:', result.error.flatten().fieldErrors);
    return {
      VITE_FIREBASE_API_KEY: 'demo-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'metodicah-demo.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'metodicah-demo',
      VITE_FIREBASE_STORAGE_BUCKET: 'metodicah-demo.appspot.com',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
      VITE_FIREBASE_APP_ID: '1:123456789:web:demo',
      VITE_FIREBASE_MEASUREMENT_ID: undefined,
    };
  }

  return result.data;
}

export const ENV = parseEnv();
