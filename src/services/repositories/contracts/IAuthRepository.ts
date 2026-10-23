import type { LoginCredentials, RegisterData, UserProfile, CreateTeamMemberData } from '@/types/metodicah';

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<UserProfile>;
  register(data: RegisterData): Promise<UserProfile>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void;

  // Multi-user Team Management within Account
  getTeamMembers(accountId: string): Promise<UserProfile[]>;
  addTeamMember(accountId: string, data: CreateTeamMemberData): Promise<UserProfile>;
  updateTeamMember(accountId: string, memberId: string, data: Partial<UserProfile>): Promise<UserProfile>;
  removeTeamMember(accountId: string, memberId: string): Promise<void>;
}
