import { describe, it, expect, beforeEach, vi } from 'vitest';
import { writeBatch, setDoc, onSnapshot } from 'firebase/firestore';
import { FirestoreClientsRepository } from './firebase/FirestoreClientsRepository';
import { FirestoreSuppliersRepository } from './firebase/FirestoreSuppliersRepository';
import { FirestoreCrewRepository } from './firebase/FirestoreCrewRepository';
import { FirestoreEventsRepository } from './firebase/FirestoreEventsRepository';
import { FirestoreSettingsRepository } from './firebase/FirestoreSettingsRepository';
import { FirestoreWorkflowRepository } from './firebase/FirestoreWorkflowRepository';
import { 
  eventsRepository, 
  clientsRepository, 
  suppliersRepository, 
  crewRepository, 
  settingsRepository,
  workflowRepository,
  authRepository,
  createRepositories
} from './index';

describe('Firestore Repository Pattern Data Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Repository Container', () => {
    it('exports valid Firestore repository singletons directly without dual proxy', () => {
      expect(eventsRepository).toBeInstanceOf(FirestoreEventsRepository);
      expect(clientsRepository).toBeInstanceOf(FirestoreClientsRepository);
      expect(suppliersRepository).toBeInstanceOf(FirestoreSuppliersRepository);
      expect(crewRepository).toBeInstanceOf(FirestoreCrewRepository);
      expect(settingsRepository).toBeInstanceOf(FirestoreSettingsRepository);
      expect(workflowRepository).toBeInstanceOf(FirestoreWorkflowRepository);
      expect(authRepository).toBeDefined();

      const customRepos = createRepositories();
      expect(customRepos.clientsRepository).toBeInstanceOf(FirestoreClientsRepository);
    });
  });

  describe('Firestore Repositories & Cloud Contracts', () => {
    it('FirestoreClientsRepository fulfills IClientsRepository contract and sanitizes undefined fields', async () => {
      const repo = new FirestoreClientsRepository();
      const clients = await repo.getClients();
      expect(Array.isArray(clients)).toBe(true);

      await expect(repo.saveClients(clients)).resolves.not.toThrow();

      const clientWithUndefined = {
        id: 'cli_clean_1',
        name: 'Cliente Sanitizado',
        email: 'clean@test.com',
        phone: '11223344',
        company: undefined,
        clientType: 'persona' as const,
        createdAt: '2026-09-08'
      };
      await repo.saveClient(clientWithUndefined);
      expect(setDoc).toHaveBeenCalled();
      const payload = vi.mocked(setDoc).mock.calls[0]?.[1] as Record<string, unknown>;
      expect('company' in payload).toBe(false);
    });

    it('FirestoreSuppliersRepository fulfills ISuppliersRepository contract', async () => {
      const repo = new FirestoreSuppliersRepository();
      const suppliers = await repo.getSuppliers();
      expect(Array.isArray(suppliers)).toBe(true);
      await expect(repo.saveSuppliers(suppliers)).resolves.not.toThrow();
    });

    it('FirestoreCrewRepository fulfills ICrewRepository contract', async () => {
      const repo = new FirestoreCrewRepository();
      const crew = await repo.getCrewMembers();
      expect(Array.isArray(crew)).toBe(true);
      await expect(repo.saveCrewMembers(crew)).resolves.not.toThrow();
    });

    it('FirestoreEventsRepository fulfills IEventsRepository contract and cascades deletion', async () => {
      const mockBatchDelete = vi.fn();
      vi.mocked(writeBatch).mockReturnValue({
        set: vi.fn(),
        update: vi.fn(),
        delete: mockBatchDelete,
        commit: vi.fn().mockResolvedValue(undefined)
      } as never);

      const repo = new FirestoreEventsRepository();
      const events = await repo.getEvents();
      expect(Array.isArray(events)).toBe(true);
      const timings = await repo.getTimings();
      expect(timings).toBeDefined();
      const logs = await repo.getLogs();
      expect(Array.isArray(logs)).toBe(true);
      const nodes = await repo.getProcessNodes();
      expect(nodes).toBeDefined();
      const accreditations = await repo.getAccreditations();
      expect(accreditations).toBeDefined();

      await expect(repo.saveEvents(events)).resolves.not.toThrow();
      await expect(repo.saveTimings(timings)).resolves.not.toThrow();
      await expect(repo.saveAccreditations(accreditations)).resolves.not.toThrow();
      await expect(repo.saveLogs(logs)).resolves.not.toThrow();
      await expect(repo.saveProcessNodes(nodes)).resolves.not.toThrow();

      mockBatchDelete.mockClear();
      await expect(repo.deleteEvent('evt_101')).resolves.not.toThrow();
      // Elimina en cascada el documento en events, timings, accreditations y process_nodes
      expect(mockBatchDelete).toHaveBeenCalledTimes(4);
    });

    it('FirestoreSettingsRepository fulfills ISettingsRepository contract', async () => {
      const repo = new FirestoreSettingsRepository();
      expect(await repo.getCompanyLogo()).toBeNull();
      const stages = await repo.getStages();
      expect(stages.length).toBeGreaterThan(0);
      const scopes = await repo.getConfiguredScopes();
      expect(Array.isArray(scopes)).toBe(true);
      const user = await repo.getUserProfile();
      expect(user).toBeDefined();
      const dateFormat = await repo.getDateFormat();
      expect(dateFormat).toBeDefined();

      await expect(repo.saveCompanyLogo(null)).resolves.not.toThrow();
      await expect(repo.saveStages(stages)).resolves.not.toThrow();
      await expect(repo.saveConfiguredScopes(scopes)).resolves.not.toThrow();
      await expect(repo.saveUserProfile(user)).resolves.not.toThrow();
      await expect(repo.saveDateFormat(dateFormat)).resolves.not.toThrow();
      const rolePermissions = await repo.getRolePermissions();
      expect(rolePermissions.length).toBeGreaterThan(0);
      await expect(repo.saveRolePermissions(rolePermissions)).resolves.not.toThrow();
    });

    it('FirestoreWorkflowRepository fulfills IWorkflowRepository contract', async () => {
      const repo = new FirestoreWorkflowRepository();
      const workflows = await repo.getWorkflows();
      expect(Array.isArray(workflows)).toBe(true);

      const scoped = await repo.getWorkflows('acc_test_123');
      expect(Array.isArray(scoped)).toBe(true);

      const newWf = {
        id: 'wf_cloud_test',
        name: 'Workflow Cloud Test',
        category: 'Producción General',
        isDefault: false,
        nodes: [],
        createdAt: '2026-03-01',
        updatedAt: '2026-03-01'
      };

      await expect(repo.saveWorkflow(newWf)).resolves.toMatchObject({ id: 'wf_cloud_test' });
      const afterSave = await repo.getWorkflows();
      expect(afterSave.some(w => w.id === 'wf_cloud_test')).toBe(true);

      await expect(repo.deleteWorkflow('wf_cloud_test')).resolves.not.toThrow();
      const afterDelete = await repo.getWorkflows();
      expect(afterDelete.some(w => w.id === 'wf_cloud_test')).toBe(false);
    });

    it('reverts in-memory state and throws translated Spanish error when Firestore rejects a write', async () => {
      const repo = new FirestoreClientsRepository();
      const initialClients = await repo.getClients();

      vi.mocked(setDoc).mockRejectedValueOnce({ code: 'permission-denied' });

      await expect(
        repo.saveClient({
          id: 'cli_denied',
          name: 'Denegado',
          email: 'denied@test.com',
          phone: '111',
          clientType: 'persona',
          createdAt: '2026-10-22'
        })
      ).rejects.toThrow(/No tienes permisos suficientes/i);

      const currentClients = await repo.getClients();
      expect(currentClients).toEqual(initialClients);
    });

    it('encapsulates real-time onSnapshot subscriptions and returns unsubscribe cleanup', () => {
      const repo = new FirestoreEventsRepository();
      const unsub = repo.subscribeEvents(() => {});
      expect(onSnapshot).toHaveBeenCalledTimes(1);
      expect(typeof unsub).toBe('function');
    });
  });
});
