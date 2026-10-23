import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { WorkflowHeader } from './WorkflowHeader';
import { CreateWorkflowModal } from './CreateWorkflowModal';
import { AddWorkflowNodeModal } from './AddWorkflowNodeModal';
import { WorkflowCanvas } from './WorkflowCanvas';
import { ToastProvider } from '@/context/ToastContext';
import { useWorkflowStore } from '@/stores';
import { workflowRepository } from '@/services/repositories';
import type { WorkflowDefinition } from '@/types/metodicah';

describe('Workflow & Process Pipeline Suite', () => {
  const mockWorkflow: WorkflowDefinition = {
    id: 'wf_test_01',
    name: 'Pipeline de Prueba Festivales',
    description: 'Protocolo de prueba para montaje técnico',
    category: 'Producción General',
    isDefault: true,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
    nodes: [
      {
        id: 'node_test_1',
        workflowId: 'wf_test_01',
        label: 'Permisos & Habilitaciones',
        category: 'Legal & Seguros',
        predecessorIds: [],
        successorIds: ['node_test_2'],
        status: 'completed',
        estimatedHours: 12,
        assignedTo: 'Legales METODICAH',
        position: { x: 50, y: 100 }
      },
      {
        id: 'node_test_2',
        workflowId: 'wf_test_01',
        label: 'Montaje de Escenario',
        category: 'Infraestructura',
        predecessorIds: ['node_test_1'],
        successorIds: [],
        status: 'active',
        estimatedHours: 8,
        assignedTo: 'Rigging Pro SRL',
        position: { x: 320, y: 100 }
      }
    ]
  };

  beforeEach(() => {
    localStorage.clear();
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    useWorkflowStore.setState({
      workflows: [mockWorkflow],
      selectedWorkflowId: 'wf_test_01',
      isLoading: false,
      isSyncing: false,
      error: null
    });
  });

  describe('WorkflowHeader', () => {
    it('renderiza título, selector de flujos y cálculo de métricas (KPIs)', () => {
      render(
        <ToastProvider>
          <WorkflowHeader
            currentWorkflow={mockWorkflow}
            onOpenCreateWorkflowModal={vi.fn()}
            onOpenAddNodeModal={vi.fn()}
          />
        </ToastProvider>
      );

      expect(screen.getByText('Workflow & Procesos')).toBeDefined();
      expect(screen.getByText('ORGANIZACIÓN')).toBeDefined();
      expect(screen.getByText('Hitos del Flujo')).toBeDefined();
      expect(screen.getByText('2')).toBeDefined(); // 2 hitos
      expect(screen.getByText('20 hs')).toBeDefined(); // 12 + 8 = 20hs
      expect(screen.getByText('Completados')).toBeDefined();
      expect(screen.getByText('En Progreso')).toBeDefined();
      expect(screen.getByRole('button', { name: /Nuevo Flujo/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Agregar Hito/i })).toBeDefined();
    });

    it('llama a callbacks al presionar Nuevo Flujo y Agregar Hito', () => {
      const onOpenCreate = vi.fn();
      const onOpenAddNode = vi.fn();

      render(
        <ToastProvider>
          <WorkflowHeader
            currentWorkflow={mockWorkflow}
            onOpenCreateWorkflowModal={onOpenCreate}
            onOpenAddNodeModal={onOpenAddNode}
          />
        </ToastProvider>
      );

      fireEvent.click(screen.getByRole('button', { name: /Nuevo Flujo/i }));
      expect(onOpenCreate).toHaveBeenCalledOnce();

      fireEvent.click(screen.getByRole('button', { name: /Agregar Hito/i }));
      expect(onOpenAddNode).toHaveBeenCalledOnce();
    });

    it('llama a onSelectWorkflow al cambiar la selección en el dropdown de Flujo Activo', () => {
      const secondWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        id: 'wf_test_02',
        name: 'Pipeline Gira 2026'
      };

      useWorkflowStore.setState({
        workflows: [mockWorkflow, secondWorkflow],
        selectedWorkflowId: 'wf_test_01'
      });

      const onSelectWorkflow = vi.fn();

      render(
        <ToastProvider>
          <WorkflowHeader
            currentWorkflow={mockWorkflow}
            onSelectWorkflow={onSelectWorkflow}
            onOpenCreateWorkflowModal={vi.fn()}
            onOpenAddNodeModal={vi.fn()}
          />
        </ToastProvider>
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'wf_test_02' } });

      expect(onSelectWorkflow).toHaveBeenCalledWith('wf_test_02');
    });
  });

  describe('CreateWorkflowModal', () => {
    it('renderiza campos para crear un nuevo flujo', () => {
      render(
        <ToastProvider>
          <CreateWorkflowModal isOpen={true} onClose={vi.fn()} />
        </ToastProvider>
      );

      expect(screen.getByText('Nuevo Flujo de Trabajo')).toBeDefined();
      expect(screen.getByLabelText(/Nombre del Flujo/i)).toBeDefined();
      expect(screen.getByLabelText(/Descripción del Protocolo/i)).toBeDefined();
      expect(screen.getByLabelText(/Categoría/i)).toBeDefined();
      expect(screen.getByLabelText(/Plantilla Base/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /Crear Flujo de Trabajo/i })).toBeDefined();
    });

    it('muestra error de validación cuando el nombre del flujo es inválido', async () => {
      const onClose = vi.fn();
      render(
        <ToastProvider>
          <CreateWorkflowModal isOpen={true} onClose={onClose} />
        </ToastProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Crear Flujo de Trabajo/i }));
      });

      expect(await screen.findByText(/El nombre del flujo es obligatorio/i)).toBeDefined();
      expect(onClose).not.toHaveBeenCalled();
    });

    it('permite ingresar datos y crear un nuevo flujo de la organización', async () => {
      const onClose = vi.fn();
      render(
        <ToastProvider>
          <CreateWorkflowModal isOpen={true} onClose={onClose} />
        </ToastProvider>
      );

      const nameInput = screen.getByLabelText(/Nombre del Flujo/i);
      fireEvent.change(nameInput, { target: { value: 'Pipeline Corporativo Nuevo' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Crear Flujo de Trabajo/i }));
      });

      const workflows = useWorkflowStore.getState().workflows;
      expect(workflows.some(w => w.name === 'Pipeline Corporativo Nuevo')).toBe(true);
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('AddWorkflowNodeModal', () => {
    it('renderiza formulario para agregar un nuevo hito con predecesor', () => {
      render(
        <ToastProvider>
          <AddWorkflowNodeModal
            isOpen={true}
            onClose={vi.fn()}
            workflowId="wf_test_01"
            existingNodes={mockWorkflow.nodes}
          />
        </ToastProvider>
      );

      expect(screen.getByText('Agregar Hito / Nodo al Flujo')).toBeDefined();
      expect(screen.getByLabelText(/Nombre de la Tarea/i)).toBeDefined();
      expect(screen.getByLabelText(/Categoría Técnica/i)).toBeDefined();
      expect(screen.getByLabelText(/Responsable \/ Proveedor/i)).toBeDefined();
      expect(screen.getByLabelText(/Horas Estimadas/i)).toBeDefined();
      expect(screen.getByLabelText(/Dependencia \/ Nodo Predecesor/i)).toBeDefined();
    });

    it('muestra error de validación cuando la etiqueta del nodo es requerida', async () => {
      const onClose = vi.fn();
      render(
        <ToastProvider>
          <AddWorkflowNodeModal
            isOpen={true}
            onClose={onClose}
            workflowId="wf_test_01"
            existingNodes={mockWorkflow.nodes}
          />
        </ToastProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Agregar Hito al Flujo/i }));
      });

      expect(await screen.findByText(/El nombre del hito es obligatorio/i)).toBeDefined();
      expect(onClose).not.toHaveBeenCalled();
    });

    it('agrega un nuevo nodo al flujo seleccionado', async () => {
      const onClose = vi.fn();
      render(
        <ToastProvider>
          <AddWorkflowNodeModal
            isOpen={true}
            onClose={onClose}
            workflowId="wf_test_01"
            existingNodes={mockWorkflow.nodes}
          />
        </ToastProvider>
      );

      const labelInput = screen.getByLabelText(/Nombre de la Tarea/i);
      fireEvent.change(labelInput, { target: { value: 'Alineación Acústica FOH' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Agregar Hito al Flujo/i }));
      });

      const currentWf = useWorkflowStore.getState().workflows.find(w => w.id === 'wf_test_01');
      expect(currentWf?.nodes.some(n => n.label === 'Alineación Acústica FOH')).toBe(true);
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('WorkflowCanvas', () => {
    it('renderiza el canvas y la leyenda de estados', () => {
      render(
        <ToastProvider>
          <WorkflowCanvas
            workflow={mockWorkflow}
            onOpenAddNodeModal={vi.fn()}
          />
        </ToastProvider>
      );

      expect(screen.getByText('Pipeline de Prueba Festivales')).toBeDefined();
      expect(screen.getAllByText('Completado').length).toBeGreaterThan(0);
      expect(screen.getAllByText('En Progreso').length).toBeGreaterThan(0);
      expect(screen.getByText('Permisos & Habilitaciones')).toBeDefined();
      expect(screen.getByText('Montaje de Escenario')).toBeDefined();
    });

    it('muestra estado vacío cuando el flujo no contiene nodos', () => {
      const emptyWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        id: 'wf_empty',
        nodes: []
      };

      const onAdd = vi.fn();
      render(
        <ToastProvider>
          <WorkflowCanvas
            workflow={emptyWorkflow}
            onOpenAddNodeModal={onAdd}
          />
        </ToastProvider>
      );

      expect(screen.getByText('Flujo sin hitos configurados')).toBeDefined();
      const addBtn = screen.getByRole('button', { name: /Agregar Primer Hito/i });
      expect(addBtn).toBeDefined();

      fireEvent.click(addBtn);
      expect(onAdd).toHaveBeenCalledOnce();
    });
  });

  describe('WorkflowView Route & Switcher Integration', () => {
    it('conmuta entre flujos sin provocar bucle reactivo ni oscilaciones de render', async () => {
      const { WorkflowView } = await import('@/views/WorkflowView');

      const testWorkflows: WorkflowDefinition[] = [
        {
          ...mockWorkflow,
          id: 'wf_01',
          name: 'Pipeline Estándar de Producción Integral'
        },
        {
          ...mockWorkflow,
          id: 'wf_02',
          name: 'Flujo Rápido Corporativo & BTL'
        }
      ];

      vi.spyOn(workflowRepository, 'getWorkflows').mockResolvedValue(testWorkflows);

      useWorkflowStore.setState({
        workflows: testWorkflows,
        selectedWorkflowId: 'wf_01'
      });

      render(
        <MemoryRouter initialEntries={['/workflow/wf_01']}>
          <Routes>
            <Route path="/workflow/:workflowId" element={<WorkflowView />} />
            <Route path="/workflow" element={<WorkflowView />} />
          </Routes>
        </MemoryRouter>
      );

      // Comprobar que inicialmente renderiza el primer flujo tras la carga
      expect(await screen.findByText('Pipeline Estándar de Producción Integral')).toBeDefined();

      // Cambiar el select a wf_02
      const select = screen.getByRole('combobox');
      await act(async () => {
        fireEvent.change(select, { target: { value: 'wf_02' } });
      });

      // El store debe mantenerse en wf_02 de forma estable sin oscilación infinita
      expect(useWorkflowStore.getState().selectedWorkflowId).toBe('wf_02');
      expect(await screen.findByText('Flujo Rápido Corporativo & BTL')).toBeDefined();
    });
  });
});
