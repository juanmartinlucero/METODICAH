import type { EventCrewMember } from '@/types/metodicah';

export interface ICrewRepository {
  getCrewMembers(): Promise<EventCrewMember[]>;
  saveCrewMembers(members: EventCrewMember[]): Promise<void>;
  saveCrewMember?(member: EventCrewMember): Promise<EventCrewMember>;
  deleteCrewMember?(id: string): Promise<void>;
  subscribeCrewMembers?(onData: (members: EventCrewMember[]) => void, onError?: (error: string) => void): () => void;
}
