import { create } from 'zustand';
import type { Supplier } from '../types/metodicah';
import { suppliersRepository } from '../services/repositories';
import { generateId } from '@/utils/idUtils';
import { getTodayLocalDateString } from '@/utils/dateUtils';
import { formatFirebaseError } from '@/utils/firebaseErrors';

interface SuppliersState {
  suppliers: Supplier[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Actions
  loadSuppliers: () => Promise<void>;
  subscribeSuppliers: () => () => void;
  addSupplier: (newSupplier: Omit<Supplier, 'id' | 'createdAt'>) => Supplier;
  addSuppliersBulk: (newSuppliersList: Omit<Supplier, 'id' | 'createdAt'>[]) => void;
  updateSupplier: (updatedSupplier: Supplier) => void;
  deleteSupplier: (supplierId: string) => void;
  getSupplierById: (supplierId: string) => Supplier | undefined;
}

export const useSuppliersStore = create<SuppliersState>((set, get) => ({
  suppliers: [],
  isLoading: false,
  isSyncing: false,
  error: null,

  loadSuppliers: async () => {
    set({ isLoading: true, error: null });
    try {
      const suppliers = await suppliersRepository.getSuppliers();
      set({ suppliers, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: formatFirebaseError(err, 'Error al cargar proveedores') });
    }
  },

  subscribeSuppliers: () => {
    if (!suppliersRepository.subscribeSuppliers) return () => {};
    return suppliersRepository.subscribeSuppliers(
      (suppliers) => {
        if (!get().isSyncing) {
          set({ suppliers, isLoading: false });
        }
      },
      (errorMsg) => {
        set({ error: errorMsg, isLoading: false });
      }
    );
  },

  addSupplier: (newSupplier) => {
    const previous = get().suppliers;
    const supplier: Supplier = {
      ...newSupplier,
      id: generateId('sup'),
      createdAt: getTodayLocalDateString()
    };
    const updated = [supplier, ...previous];
    set({ suppliers: updated, isSyncing: true, error: null });

    suppliersRepository.saveSuppliers(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        suppliers: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al guardar proveedor')
      }));

    return supplier;
  },

  addSuppliersBulk: (newSuppliersList) => {
    const previous = get().suppliers;
    const now = getTodayLocalDateString();
    const newSuppliers: Supplier[] = newSuppliersList.map(s => ({
      ...s,
      id: generateId('sup'),
      createdAt: now
    }));
    const updated = [...newSuppliers, ...previous];
    set({ suppliers: updated, isSyncing: true, error: null });

    suppliersRepository.saveSuppliers(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        suppliers: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al importar proveedores')
      }));
  },

  updateSupplier: (updatedSupplier) => {
    const previous = get().suppliers;
    const updated = previous.map(s => 
      s.id === updatedSupplier.id ? { ...updatedSupplier, updatedAt: getTodayLocalDateString() } : s
    );
    set({ suppliers: updated, isSyncing: true, error: null });

    suppliersRepository.saveSuppliers(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        suppliers: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al actualizar proveedor')
      }));
  },

  deleteSupplier: (supplierId) => {
    const previous = get().suppliers;
    const updated = previous.filter(s => s.id !== supplierId);
    set({ suppliers: updated, isSyncing: true, error: null });

    suppliersRepository.saveSuppliers(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        suppliers: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al eliminar proveedor')
      }));
  },

  getSupplierById: (supplierId) => {
    return get().suppliers.find(s => s.id === supplierId);
  }
}));

// Hydrate from repository on startup
void useSuppliersStore.getState().loadSuppliers();
