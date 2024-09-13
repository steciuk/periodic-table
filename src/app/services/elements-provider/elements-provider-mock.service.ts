import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { PeriodicElement } from '../../types/PeriodicElement';
import { delay, from, map, Observable, switchMap, take } from 'rxjs';
import { indexedDB, rx } from './IndexedDB';
import { ElementsProviderService } from './elements-provider.service';

const MOCK_SERVER_DELAY = 1000;

@Injectable()
export class ElementsProviderMockService extends ElementsProviderService {
  private readonly http = inject(HttpService);

  constructor() {
    super();

    // If no elements are in the database, fetch them from the server
    indexedDB.elements.count().then((count) => {
      if (count === 0) {
        this.getDefaultElements$().subscribe((elements) => {
          indexedDB.elements.bulkAdd(elements);
        });
      }
    });
  }

  get$(id: number) {
    return rx(() => indexedDB.elements.get(id)).pipe(delay(MOCK_SERVER_DELAY));
  }

  getAll$() {
    return rx(() => indexedDB.elements.toArray()).pipe(
      delay(MOCK_SERVER_DELAY),
    );
  }

  update$(element: PeriodicElement) {
    // TODO: Data validation as this simulates backend
    return from(indexedDB.elements.put(element)).pipe(delay(MOCK_SERVER_DELAY));
  }

  discardChanges$() {
    return this.getDefaultElements$().pipe(
      switchMap((elements) =>
        from(
          (async () => {
            await indexedDB.elements.clear();
            await indexedDB.elements.bulkAdd(elements);
          })(),
        ),
      ),
      delay(MOCK_SERVER_DELAY),
    );
  }

  private getDefaultElements$(): Observable<PeriodicElement[]> {
    return this.http.get<{ elements: PeriodicElement[] }>('elements.json').pipe(
      map((response) => response.elements),
      take(1),
    );
  }
}
