import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useClientsStore } from './useClientsStore';
import { useEventsStore } from './useEventsStore';
import { useSettingsStore } from './useSettingsStore';
import { useWorkflowStore } from './useWorkflowStore';
import { clientsRepository, settingsRepository } from '@/services/repositories';

describe('Zustand Stores (Tier 3 Optimistic UI & Real-Time Sync)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('useClientsStore', () => {
    it('creates, updates and deletes a client with optimistic UI', async () => {
      const saveSpy = vi.spyOn(clientsRepository, 'saveClients');
      const initialCount = useClientsStore.getState().clients.length;

      // 1. Add Client
      const newClient = useClientsStore.getState().addClient({
        name: 'Productora Test',
        email: 'test@productora.com',
        phone: '1155550000',
        clientType: 'empresa',
        company: 'Productora Test SA'
      });

      expect(newClient.id).toBeDefined();
      expect(useClientsStore.getState().clients.length).toBe(initialCount + 1);
      expect(saveSpy).toHaveBeenCalledTimes(1);

      await new Promise(r => setTimeout(r, 10));
      expect(useClientsStore.getState().isSyncing).toBe(false);

      // 2. Update Client
      useClientsStore.getState().updateClient({
        ...newClient,
        name: 'Productora Test Renombrada'
      });
      const updated = useClientsStore.getState().getClientById(newClient.id);
      expect(updated?.name).toBe('Productora Test Renombrada');

      // 3. Delete Client
      useClientsStore.getState().deleteClient(newClient.id);
      expect(useClientsStore.getState().getClientById(newClient.id)).toBeUndefined();
      expect(useClientsStore.getState().clients.length).toBe(initialCount);
    });

    it('rolls back optimistic client addition when Firestore persistence fails', async () => {
      const initialClients = useClientsStore.getState().clients;
      vi.spyOn(clientsRepository, 'saveClients').mockRejectedValueOnce(
        new Error('No tienes permisos suficientes para realizar esta operación.')
      );

      const added = useClientsStore.getState().addClient({
        name: 'Cliente Fallido',
        email: 'fail@test.com',
        phone: '1100001111',
        clientType: 'persona'
      });

      // Immediately present in optimistic state
      expect(useClientsStore.getState().getClientById(added.id)).toBeDefined();

      // Wait for async rejection and rollback
      await new Promise(r => setTimeout(r, 15));

      expect(useClientsStore.getState().getClientById(added.id)).toBeUndefined();
      expect(useClientsStore.getState().clients).toEqual(initialClients);
      expect(useClientsStore.getState().error).toMatch(/No tienes permisos suficientes/i);
    });
  });

  describe('useEventsStore', () => {
    it('creates an event, updates stage and adds timing items', async () => {
      const initialCount = useEventsStore.getState().events.length;

      // 1. Create Event
      const created = useEventsStore.getState().createEvent({
        title: 'Recital Vitest Arena',
        date: '2026-11-20',
        venue: 'Estadio Obras',
        location: 'Buenos Aires',
        clientId: 'cli_1',
        clientName: 'Cliente Test',
        timeRange: {
          startTime: '18:00',
          endTime: '23:00'
        },
        stageId: 'backlog'
      });

      expect(created.id).toBeDefined();
      expect(created.code).toBeDefined();
      expect(useEventsStore.getState().events.length).toBe(initialCount + 1);

      // 2. Update Event Stage
      useEventsStore.getState().updateEventStage(created.id, 'prod');
      const found = useEventsStore.getState().events.find(e => e.id === created.id);
      expect(found?.stageId).toBe('prod');

      // 3. Update Event Details
      useEventsStore.getState().updateEvent({
        ...created,
        stageId: 'prod',
        venue: 'Estadio Movistar Arena'
      });
      const updatedEvent = useEventsStore.getState().events.find(e => e.id === created.id);
      expect(updatedEvent?.venue).toBe('Estadio Movistar Arena');

      // 4. Add Timing Item
      useEventsStore.getState().addTimingItem({
        timeStart: '15:00',
        timeEnd: '16:00',
        title: 'Prueba de sonido',
        sector: 'Audio',
        responsible: 'Técnico FOH',
        status: 'pending',
        order: 1
      });

      const allTimings = Object.values(useEventsStore.getState().timingsMap).flat();
      expect(allTimings.some(t => t.title === 'Prueba de sonido')).toBe(true);

      await new Promise(r => setTimeout(r, 10));
    });

    it('manages process nodes with persistence', async () => {
      useEventsStore.setState({
        processNodesMap: {
          evt_101: [
            {
              id: 'node_1',
              workflowId: 'wf_1',
              label: 'Brief Inicial',
              category: 'Legal',
              status: 'pending',
              estimatedHours: 4,
              assignedTo: 'Técnico FOH',
              predecessorIds: [],
              successorIds: [],
              position: { x: 0, y: 0 }
            }
          ]
        }
      });
      useEventsStore.getState().updateProcessNode('evt_101', 'node_1', { status: 'active' });
      const nodes = useEventsStore.getState().processNodesMap['evt_101'];
      const node1 = nodes?.find(n => n.id === 'node_1');
      expect(node1?.status).toBe('active');

      await new Promise(r => setTimeout(r, 10));
      expect(useEventsStore.getState().isSyncing).toBe(false);
    });
  });

  describe('useSettingsStore', () => {
    it('updates user profile and date format with rollback protection', async () => {
      const originalUser = useSettingsStore.getState().currentUser;

      useSettingsStore.getState().updateUserProfile({
        ...originalUser,
        name: 'Nuevo Nombre Operador',
        phone: '+54 9 11 9999-8888'
      });

      expect(useSettingsStore.getState().currentUser.name).toBe('Nuevo Nombre Operador');

      useSettingsStore.getState().updateDateFormat('YYYY-MM-DD');
      expect(useSettingsStore.getState().dateFormat).toBe('YYYY-MM-DD');
      expect(localStorage.getItem('metodicah_date_format')).toBe('YYYY-MM-DD');

      // Verify rollback on failure
      vi.spyOn(settingsRepository, 'saveDateFormat').mockRejectedValueOnce(new Error('Fallo de red'));
      useSettingsStore.getState().updateDateFormat('MM/DD/YYYY');
      expect(useSettingsStore.getState().dateFormat).toBe('MM/DD/YYYY');

      await new Promise(r => setTimeout(r, 15));
      expect(useSettingsStore.getState().dateFormat).toBe('YYYY-MM-DD');
    });
  });

  describe('useWorkflowStore', () => {
    it('creates, updates and deletes workflows and manages nodes', async () => {
      const store = useWorkflowStore.getState();
      const initialCount = store.workflows.length;

      // 1. Create Workflow
      const created = await store.createWorkflow({
        name: 'Flujo Automatizado de Prueba',
        description: 'Pipeline para pruebas de integración',
        category: 'Producción General',
        isDefault: false,
        nodes: []
      });

      expect(created.id).toBeDefined();
      expect(useWorkflowStore.getState().workflows.length).toBe(initialCount + 1);
      expect(useWorkflowStore.getState().selectedWorkflowId).toBe(created.id);

      // 2. Add Node to Workflow
      const addedNode = await store.addNodeToWorkflow(created.id, {
        label: 'Verificación de Seguridad',
        category: 'Legal & Seguros',
        assignedTo: 'Prevención de Riesgos',
        estimatedHours: 6,
        status: 'pending',
        predecessorIds: [],
        successorIds: []
      });

      expect(addedNode.id).toBeDefined();
      const targetWf = useWorkflowStore.getState().workflows.find(w => w.id === created.id);
      expect(targetWf?.nodes.length).toBe(1);

      // 3. Update Node status
      await store.updateNodeInWorkflow(created.id, addedNode.id, { status: 'completed' });
      const updatedWf = useWorkflowStore.getState().workflows.find(w => w.id === created.id);
      expect(updatedWf?.nodes[0].status).toBe('completed');

      // 4. Update Node position
      store.updateNodePosition(created.id, addedNode.id, { x: 200, y: 300 });
      const movedWf = useWorkflowStore.getState().workflows.find(w => w.id === created.id);
      expect(movedWf?.nodes[0].position).toEqual({ x: 200, y: 300 });

      // 5. Delete Node
      await store.deleteNodeFromWorkflow(created.id, addedNode.id);
      const wfWithoutNodes = useWorkflowStore.getState().workflows.find(w => w.id === created.id);
      expect(wfWithoutNodes?.nodes.length).toBe(0);

      // 6. Delete Workflow
      await store.deleteWorkflow(created.id);
      expect(useWorkflowStore.getState().workflows.some(w => w.id === created.id)).toBe(false);
    });
  });
});
