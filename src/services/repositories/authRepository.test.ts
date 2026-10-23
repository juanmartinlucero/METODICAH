import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  type UserCredential
} from 'firebase/auth';
import { getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FirebaseAuthRepository } from './firebase/FirebaseAuthRepository';
import { auth } from '@/services/firebase';
import type { UserProfile } from '@/types/metodicah';

describe('FirebaseAuthRepository Test Suite', () => {
  let repo: FirebaseAuthRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    (auth as { currentUser: unknown }).currentUser = null;
    repo = new FirebaseAuthRepository();
  });

  it('permite iniciar sesión y mapea el perfil de Firestore', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
      user: {
        uid: 'usr_01',
        email: 'juan@metodicah.com',
        displayName: 'Juan Martín'
      }
    } as unknown as UserCredential);

    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        globalRole: 'admin',
        accountId: 'acc_demo_01',
        companyName: 'METODICAH Studio'
      })
    } as never);

    const user = await repo.login({
      email: 'juan@metodicah.com',
      password: 'password123'
    });

    expect(user.email).toBe('juan@metodicah.com');
    expect(user.name).toBe('Juan Martín');
    expect(user.globalRole).toBe('admin');
    expect(user.accountId).toBe('acc_demo_01');
  });

  it('traduce códigos de error de Firebase Auth a mensajes en español', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce({
      code: 'auth/invalid-credential'
    });

    await expect(
      repo.login({
        email: 'juan@metodicah.com',
        password: 'wrongPassword'
      })
    ).rejects.toThrow(/Credenciales incorrectas/i);
  });

  it('registra una nueva productora con rol admin y sanitiza campos undefined al guardar en Firestore', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce({
      user: {
        uid: 'usr_new_admin',
        email: 'lucia@video.com',
        displayName: 'Lucía Video'
      }
    } as unknown as UserCredential);

    const newAdmin = await repo.register({
      companyName: 'Lucía Video Producciones',
      name: 'Lucía Video',
      email: 'lucia@video.com',
      password: 'secretPassword',
      specialty: 'Dirección de Cámaras & Video'
    });

    expect(newAdmin.name).toBe('Lucía Video');
    expect(newAdmin.email).toBe('lucia@video.com');
    expect(newAdmin.companyName).toBe('Lucía Video Producciones');
    expect(newAdmin.globalRole).toBe('admin');
    expect(newAdmin.accountId).toBe('acc_usr_new_admin');

    expect(setDoc).toHaveBeenCalledTimes(1);
    const savedPayload = vi.mocked(setDoc).mock.calls[0]?.[1] as Record<string, unknown>;
    expect('phone' in savedPayload).toBe(false);
  });

  it('evita registrar cuentas duplicadas traduciendo auth/email-already-in-use', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce({
      code: 'auth/email-already-in-use'
    });

    await expect(
      repo.register({
        companyName: 'Otra Empresa',
        name: 'Martín Clon',
        email: 'martin@tecnico.com',
        password: 'password123'
      })
    ).rejects.toThrow(/Este correo ya se encuentra registrado/i);
  });

  it('permite al admin gestionar integrantes de su cuenta y protege al Administrador Principal', async () => {
    const newMember = await repo.addTeamMember('acc_demo_01', {
      name: 'Marcos Sonidista',
      email: 'marcos@sonido.com',
      password: 'password456',
      globalRole: 'team_member',
      specialty: 'FOH Mixer'
    });

    expect(newMember.accountId).toBe('acc_demo_01');
    expect(newMember.name).toBe('Marcos Sonidista');
    expect(newMember.globalRole).toBe('team_member');
    expect(setDoc).toHaveBeenCalled();

    // Obtener miembros filtrados por accountId
    vi.mocked(getDocs).mockResolvedValueOnce({
      forEach: (cb: (doc: { data: () => UserProfile }) => void) => {
        cb({ data: () => newMember });
      }
    } as never);

    const members = await repo.getTeamMembers('acc_demo_01');
    expect(members).toHaveLength(1);
    expect(members[0].email).toBe('marcos@sonido.com');

    // Actualizar miembro
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => newMember
    } as never);

    const updated = await repo.updateTeamMember('acc_demo_01', newMember.id, {
      specialty: 'Lead Audio Engineer'
    });
    expect(updated.specialty).toBe('Lead Audio Engineer');
    expect(updateDoc).toHaveBeenCalled();

    // Impedir eliminar al Administrador Principal
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        ...newMember,
        id: 'usr_admin',
        globalRole: 'admin'
      })
    } as never);

    await expect(
      repo.removeTeamMember('acc_demo_01', 'usr_admin')
    ).rejects.toThrow(/No es posible eliminar al Administrador Principal/i);

    // Eliminar miembro regular
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => newMember
    } as never);

    await repo.removeTeamMember('acc_demo_01', newMember.id);
    expect(deleteDoc).toHaveBeenCalled();
  });

  it('notifica a los observadores mediante onAuthStateChanged y permite cerrar sesión', async () => {
    vi.mocked(onFirebaseAuthStateChanged).mockImplementation((_auth, cb) => {
      if (typeof cb === 'function') {
        void cb({
          uid: 'usr_01',
          email: 'juan@metodicah.com',
          displayName: 'Juan Martín'
        } as never);
      }
      return () => {};
    });

    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => false,
      data: () => undefined
    } as never);

    const states: (string | null)[] = [];
    const unsubscribe = repo.onAuthStateChanged((user) => {
      states.push(user ? user.email : null);
    });

    await new Promise(r => setTimeout(r, 10));
    expect(states).toContain('juan@metodicah.com');

    await repo.logout();
    expect(signOut).toHaveBeenCalled();
    unsubscribe();
  });
});
