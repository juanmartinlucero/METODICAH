import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock global de Firebase SDK para aislar pruebas en jsdom sin tráfico de red
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({}))
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
  onAuthStateChanged: vi.fn(() => () => {}),
  updateProfile: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({}))
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  initializeFirestore: vi.fn(() => ({})),
  persistentLocalCache: vi.fn(() => ({})),
  persistentMultipleTabManager: vi.fn(() => ({})),
  collection: vi.fn((_db: unknown, name?: string) => ({ id: name ?? 'col', path: name ?? 'col' })),
  doc: vi.fn((_colOrDb: unknown, idOrPath?: string, maybeId?: string) => ({
    id: maybeId ?? idOrPath ?? 'mock_doc_id',
    path: maybeId ? `${idOrPath}/${maybeId}` : `col/${idOrPath ?? 'mock_doc_id'}`
  })),
  query: vi.fn((col: unknown) => col),
  where: vi.fn(() => ({})),
  getDocs: vi.fn().mockResolvedValue({ empty: true, docs: [], forEach: () => {} }),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => undefined }),
  setDoc: vi.fn().mockResolvedValue(undefined),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  deleteDoc: vi.fn().mockResolvedValue(undefined),
  onSnapshot: vi.fn(() => () => {}),
  writeBatch: vi.fn(() => ({
    set: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    commit: vi.fn().mockResolvedValue(undefined)
  }))
}));

// In-memory localStorage mock for UI preferences isolation
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
