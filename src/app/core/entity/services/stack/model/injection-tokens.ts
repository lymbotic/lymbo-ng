/** Injection token for stack persistence Firestore */
import {InjectionToken} from '@angular/core';
import {StacksPersistenceService} from '../persistence/stacks-persistence.interface';

export let STACK_PERSISTENCE_FIRESTORE = new InjectionToken<StacksPersistenceService>('app.stack-persistence-firestore');
/** Injection token for stack persistence PouchDB */
export let STACK_PERSISTENCE_POUCHDB = new InjectionToken<StacksPersistenceService>('app.stack-persistence-pouchdb');
