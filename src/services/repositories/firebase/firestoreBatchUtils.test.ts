import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  commitBatchInChunks, 
  syncCollectionWithBatch, 
  type BatchOperation 
} from './firestoreBatchUtils';
import type { Firestore, CollectionReference, DocumentReference } from 'firebase/firestore';

const { mockSet, mockDelete, mockCommit, mockWriteBatch, mockDoc, mockGetDocs } = vi.hoisted(() => {
  const set = vi.fn();
  const del = vi.fn();
  const commit = vi.fn().mockResolvedValue(undefined);
  const writeBatch = vi.fn(() => ({
    set,
    delete: del,
    commit
  }));
  const doc = vi.fn((_colOrDb: unknown, id?: string) => ({
    id: id ?? 'mock_doc_id',
    path: `col/${id}`
  } as unknown as DocumentReference));
  const getDocs = vi.fn();
  return {
    mockSet: set,
    mockDelete: del,
    mockCommit: commit,
    mockWriteBatch: writeBatch,
    mockDoc: doc,
    mockGetDocs: getDocs
  };
});

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual,
    writeBatch: mockWriteBatch,
    doc: mockDoc,
    getDocs: mockGetDocs
  };
});

describe('firestoreBatchUtils', () => {
  const fakeDb = {} as unknown as Firestore;
  const fakeCol = { id: 'test_col' } as unknown as CollectionReference;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCommit.mockResolvedValue(undefined);
  });

  describe('commitBatchInChunks', () => {
    it('does nothing when operations list is empty', async () => {
      await commitBatchInChunks(fakeDb, []);
      expect(mockWriteBatch).not.toHaveBeenCalled();
    });

    it('commits all operations in a single batch when under chunkSize', async () => {
      const ops: BatchOperation[] = [
        { type: 'set', ref: { id: 'doc1' } as any, data: { name: 'Item 1' } },
        { type: 'delete', ref: { id: 'doc2' } as any }
      ];

      await commitBatchInChunks(fakeDb, ops, 450);

      expect(mockWriteBatch).toHaveBeenCalledTimes(1);
      expect(mockSet).toHaveBeenCalledWith({ id: 'doc1' }, { name: 'Item 1' }, { merge: true });
      expect(mockDelete).toHaveBeenCalledWith({ id: 'doc2' });
      expect(mockCommit).toHaveBeenCalledTimes(1);
    });

    it('splits large operation sets across multiple batches when exceeding chunkSize', async () => {
      const ops: BatchOperation[] = Array.from({ length: 950 }, (_, i) => ({
        type: 'set',
        ref: { id: `doc_${i}` } as any,
        data: { index: i }
      }));

      await commitBatchInChunks(fakeDb, ops, 450);

      // 950 ops with 450 per chunk -> 3 batches (450, 450, 50)
      expect(mockWriteBatch).toHaveBeenCalledTimes(3);
      expect(mockCommit).toHaveBeenCalledTimes(3);
      expect(mockSet).toHaveBeenCalledTimes(950);
    });
  });

  describe('syncCollectionWithBatch', () => {
    it('deletes orphans detected via knownExistingIds', async () => {
      const incoming = [
        { id: 'item_1', name: 'Item 1' },
        { id: 'item_3', name: 'Item 3' }
      ];
      const knownIds = ['item_1', 'item_2', 'item_3', 'item_orphan'];

      const result = await syncCollectionWithBatch(fakeDb, fakeCol, incoming, knownIds);

      expect(result).toEqual(['item_1', 'item_3']);
      // Should create 2 delete operations (item_2, item_orphan) and 2 set operations (item_1, item_3)
      expect(mockDelete).toHaveBeenCalledTimes(2);
      expect(mockSet).toHaveBeenCalledTimes(2);
      expect(mockCommit).toHaveBeenCalledTimes(1);
    });

    it('queries collection snapshot when knownExistingIds is not provided', async () => {
      mockGetDocs.mockResolvedValueOnce({
        docs: [
          { id: 'item_remote_1' },
          { id: 'item_remote_old' }
        ]
      });

      const incoming = [
        { id: 'item_remote_1', name: 'Still exists' }
      ];

      const result = await syncCollectionWithBatch(fakeDb, fakeCol, incoming);

      expect(result).toEqual(['item_remote_1']);
      expect(mockDelete).toHaveBeenCalledTimes(1); // item_remote_old deleted
      expect(mockSet).toHaveBeenCalledTimes(1);
    });

    it('handles getDocs failure gracefully without breaking upsert operations', async () => {
      mockGetDocs.mockRejectedValueOnce(new Error('Network error'));

      const incoming = [
        { id: 'item_offline_1', name: 'Offline item' }
      ];

      const result = await syncCollectionWithBatch(fakeDb, fakeCol, incoming);

      expect(result).toEqual(['item_offline_1']);
      expect(mockDelete).not.toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledTimes(1);
    });
  });
});
