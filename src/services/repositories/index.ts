import type { IEventsRepository } from './contracts/IEventsRepository';
import type { IClientsRepository } from './contracts/IClientsRepository';
import type { ISuppliersRepository } from './contracts/ISuppliersRepository';
import type { ICrewRepository } from './contracts/ICrewRepository';
import type { ISettingsRepository } from './contracts/ISettingsRepository';
import type { IAuthRepository } from './contracts/IAuthRepository';
import type { IWorkflowRepository } from './contracts/IWorkflowRepository';

import { FirestoreEventsRepository } from './firebase/FirestoreEventsRepository';
import { FirestoreClientsRepository } from './firebase/FirestoreClientsRepository';
import { FirestoreSuppliersRepository } from './firebase/FirestoreSuppliersRepository';
import { FirestoreCrewRepository } from './firebase/FirestoreCrewRepository';
import { FirestoreSettingsRepository } from './firebase/FirestoreSettingsRepository';
import { FirebaseAuthRepository } from './firebase/FirebaseAuthRepository';
import { FirestoreWorkflowRepository } from './firebase/FirestoreWorkflowRepository';

export * from './contracts/IEventsRepository';
export * from './contracts/IClientsRepository';
export * from './contracts/ISuppliersRepository';
export * from './contracts/ICrewRepository';
export * from './contracts/ISettingsRepository';
export * from './contracts/IAuthRepository';
export * from './contracts/IWorkflowRepository';

export function createRepositories() {
  return {
    eventsRepository: new FirestoreEventsRepository(),
    clientsRepository: new FirestoreClientsRepository(),
    suppliersRepository: new FirestoreSuppliersRepository(),
    crewRepository: new FirestoreCrewRepository(),
    settingsRepository: new FirestoreSettingsRepository(),
    authRepository: new FirebaseAuthRepository(),
    workflowRepository: new FirestoreWorkflowRepository()
  };
}

const defaultRepositories = createRepositories();

export const eventsRepository: IEventsRepository = defaultRepositories.eventsRepository;
export const clientsRepository: IClientsRepository = defaultRepositories.clientsRepository;
export const suppliersRepository: ISuppliersRepository = defaultRepositories.suppliersRepository;
export const crewRepository: ICrewRepository = defaultRepositories.crewRepository;
export const settingsRepository: ISettingsRepository = defaultRepositories.settingsRepository;
export const authRepository: IAuthRepository = defaultRepositories.authRepository;
export const workflowRepository: IWorkflowRepository = defaultRepositories.workflowRepository;
