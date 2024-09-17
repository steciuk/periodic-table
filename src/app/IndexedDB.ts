import Dexie, { liveQuery, Table } from 'dexie';
import { PeriodicElement } from './types/PeriodicElement';
import { Observable } from 'rxjs';

class IndexedDB extends Dexie {
  elements!: Table<PeriodicElement, number>;

  constructor() {
    super('AppDB');
    this.version(1).stores({
      elements: 'id',
    });
  }
}

export function rx<T>(
  ...params: Parameters<typeof liveQuery<T>>
): Observable<T> {
  return new Observable((subscriber) => {
    const live$ = liveQuery<T>(...params);
    const dexieSub = live$.subscribe({
      next: (value) => subscriber.next(value),
      error: (error) => subscriber.error(error),
      complete: () => subscriber.complete(),
    });

    return () => {
      dexieSub.unsubscribe();
    };
  });
}
export const indexedDB = new IndexedDB();
