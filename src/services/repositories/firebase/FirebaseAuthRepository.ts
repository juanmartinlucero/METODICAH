import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged as onFirebaseAuthStateChanged,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/services/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import type { LoginCredentials, RegisterData, UserProfile, CreateTeamMemberData } from '@/types/metodicah';
import type { IAuthRepository } from '../contracts/IAuthRepository';
import { cleanFirestorePayload } from '@/utils/cleanFirestorePayload';
import { formatFirebaseError } from '@/utils/firebaseErrors';
import { getTodayLocalDateString } from '@/utils/dateUtils';

export class FirebaseAuthRepository implements IAuthRepository {
  private mapFirebaseUser(fbUser: FirebaseUser, extraData?: Partial<UserProfile>): UserProfile {
    return {
      id: fbUser.uid,
      name: fbUser.displayName || extraData?.name || fbUser.email?.split('@')[0] || 'Usuario METODICAH',
      email: fbUser.email || '',
      globalRole: extraData?.globalRole || 'team_member',
      accountId: extraData?.accountId || `acc_${fbUser.uid}`,
      companyName: extraData?.companyName || 'METODICAH Studio',
      avatarUrl: fbUser.photoURL || extraData?.avatarUrl || undefined,
      phone: fbUser.phoneNumber || extraData?.phone || undefined,
      specialty: extraData?.specialty || undefined,
      bio: extraData?.bio || undefined,
      location: extraData?.location || undefined,
      status: extraData?.status || 'active',
      createdAt: extraData?.createdAt || getTodayLocalDateString()
    };
  }

  private async fetchProfileFromFirestore(uid: string): Promise<Partial<UserProfile> | null> {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as Partial<UserProfile>;
      }
    } catch (err) {
      console.warn('[FirebaseAuthRepository] No se pudo obtener perfil de Firestore:', err);
    }
    return null;
  }

  private async saveProfileToFirestore(uid: string, profile: UserProfile): Promise<void> {
    try {
      await setDoc(doc(db, 'users', uid), cleanFirestorePayload(profile), { merge: true });
    } catch (err) {
      console.warn('[FirebaseAuthRepository] No se pudo guardar perfil en Firestore:', err);
    }
  }

  async login(credentials: LoginCredentials): Promise<UserProfile> {
    if (!credentials.password) {
      throw new Error('La contraseña es obligatoria para iniciar sesión.');
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, credentials.email.trim(), credentials.password.trim());
      const firestoreData = await this.fetchProfileFromFirestore(credential.user.uid);
      return this.mapFirebaseUser(credential.user, firestoreData || undefined);
    } catch (err: unknown) {
      throw new Error(formatFirebaseError(err, 'Error al iniciar sesión con Firebase.'));
    }
  }

  async register(data: RegisterData): Promise<UserProfile> {
    if (!data.password) {
      throw new Error('La contraseña es obligatoria para registrarte.');
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password.trim());
      
      if (data.name) {
        await updateProfile(credential.user, { displayName: data.name.trim() }).catch(() => {});
      }

      const accountId = `acc_${credential.user.uid}`;

      const userProfile: UserProfile = {
        id: credential.user.uid,
        name: data.name.trim(),
        email: data.email.trim(),
        globalRole: 'admin',
        accountId,
        companyName: data.companyName.trim(),
        specialty: data.specialty?.trim() || 'Dirección de Producción',
        phone: data.phone?.trim() || undefined,
        status: 'active',
        createdAt: getTodayLocalDateString()
      };

      await this.saveProfileToFirestore(credential.user.uid, userProfile);

      return userProfile;
    } catch (err: unknown) {
      throw new Error(formatFirebaseError(err, 'Error al registrar usuario en Firebase.'));
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('[FirebaseAuthRepository] Error al cerrar sesión:', err);
    }
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    const fbUser = auth.currentUser;
    if (!fbUser) return null;

    const firestoreData = await this.fetchProfileFromFirestore(fbUser.uid);
    return this.mapFirebaseUser(fbUser, firestoreData || undefined);
  }

  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    return onFirebaseAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        callback(null);
        return;
      }
      const firestoreData = await this.fetchProfileFromFirestore(fbUser.uid);
      callback(this.mapFirebaseUser(fbUser, firestoreData || undefined));
    });
  }

  async getTeamMembers(accountId: string): Promise<UserProfile[]> {
    if (!accountId) return [];
    try {
      const q = query(collection(db, 'users'), where('accountId', '==', accountId));
      const snap = await getDocs(q);
      const members: UserProfile[] = [];
      snap.forEach(d => {
        members.push(d.data() as UserProfile);
      });
      return members;
    } catch (err) {
      console.warn('[FirebaseAuthRepository] Error obteniendo miembros de equipo:', err);
      return [];
    }
  }

  async addTeamMember(accountId: string, data: CreateTeamMemberData): Promise<UserProfile> {
    try {
      const memberId = `usr_${Date.now()}`;
      const newMember: UserProfile = {
        id: memberId,
        name: data.name.trim(),
        email: data.email.trim(),
        globalRole: data.globalRole,
        accountId,
        specialty: data.specialty?.trim() || 'Operaciones Técnicas',
        phone: data.phone?.trim() || undefined,
        status: 'active',
        createdAt: getTodayLocalDateString()
      };

      await setDoc(doc(db, 'users', memberId), cleanFirestorePayload(newMember));
      return newMember;
    } catch (err) {
      throw new Error(formatFirebaseError(err, 'Error al agregar miembro de equipo en Firestore.'));
    }
  }

  async updateTeamMember(accountId: string, memberId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const userRef = doc(db, 'users', memberId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        throw new Error('El usuario no existe.');
      }
      const existing = snap.data() as UserProfile;
      if (existing.accountId !== accountId) {
        throw new Error('No tienes permisos para modificar este usuario.');
      }

      const updated: UserProfile = {
        ...existing,
        ...data,
        id: memberId,
        accountId
      };

      await updateDoc(userRef, cleanFirestorePayload({ ...data, accountId }));
      return updated;
    } catch (err) {
      throw new Error(formatFirebaseError(err, 'Error al actualizar miembro de equipo en Firestore.'));
    }
  }

  async removeTeamMember(accountId: string, memberId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', memberId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        throw new Error('El usuario no existe.');
      }
      const existing = snap.data() as UserProfile;
      if (existing.accountId !== accountId) {
        throw new Error('No tienes permisos para eliminar este usuario.');
      }
      if (existing.globalRole === 'admin') {
        throw new Error('No es posible eliminar al Administrador Principal de la productora.');
      }

      await deleteDoc(userRef);
    } catch (err) {
      throw new Error(formatFirebaseError(err, 'Error al eliminar miembro de equipo en Firestore.'));
    }
  }
}
