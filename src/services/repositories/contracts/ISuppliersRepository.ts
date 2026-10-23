import type { Supplier } from '@/types/metodicah';

export interface ISuppliersRepository {
  getSuppliers(): Promise<Supplier[]>;
  saveSuppliers(suppliers: Supplier[]): Promise<void>;
  saveSupplier?(supplier: Supplier): Promise<Supplier>;
  deleteSupplier?(id: string): Promise<void>;
  subscribeSuppliers?(onData: (suppliers: Supplier[]) => void, onError?: (error: string) => void): () => void;
}
