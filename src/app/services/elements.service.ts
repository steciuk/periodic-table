import { inject, Injectable } from '@angular/core';
import { PeriodicElement } from '../types/PeriodicElement';
import {
  catchError,
  distinctUntilChanged,
  iif,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { ElementsProviderService } from './elements-provider.service';
import { rxState } from '@rx-angular/state';
import { rxEffects } from '@rx-angular/state/effects';
import { rx, indexedDB } from '../IndexedDB';

const ARE_CHANGES_KEY = 'are-changes';
type PeriodicElementsMap = Record<PeriodicElement['id'], PeriodicElement>;

@Injectable({
  providedIn: 'root',
})
export class ElementsService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly elementsProvider = inject(ElementsProviderService);

  private readonly state = rxState<{
    areChanges: boolean;
    elements: PeriodicElementsMap;
  }>(({ set, connect }) => {
    set({
      areChanges: this.localStorageService.getItem<boolean>(ARE_CHANGES_KEY)
        ? true
        : false,
      elements: [],
    });

    connect(
      'elements',
      rx(() => indexedDB.elements.toArray()).pipe(
        // Read from IndexedDB once, as this state is our SOURCE OF TRUTH after the initial load
        catchError((err) => {
          console.error(err);
          return of([]);
        }),
        take(1),
        switchMap((elements) =>
          iif(
            () => elements.length === 0,
            // If there are no elements in the database, fetch them from the server
            this.elementsProvider
              .getDefaultElements$()
              .pipe(tap(() => console.log('Loaded elements from server'))),
            of(elements).pipe(
              tap(() => console.log('Loaded elements from IndexedDB')),
            ),
          ),
        ),
        map((elements) => this.elementsToMap(elements)),
      ),
    );
  });

  readonly elements$: Observable<PeriodicElement[]> = this.state
    .select('elements')
    .pipe(map((elements) => Object.values(elements)));

  readonly areChanges$: Observable<boolean> = this.state
    .select('areChanges')
    .pipe(distinctUntilChanged());

  getElement$(id: number): Observable<PeriodicElement | null> {
    return this.state
      .select('elements')
      .pipe(map((elements) => elements[id] ?? null));
  }

  updateElement(element: PeriodicElement): void {
    this.state.set((state) => ({
      areChanges: true,
      elements: {
        ...state.elements,
        [element.id]: element,
      },
    }));
  }

  discardChanges(): void {
    this.elementsProvider.getDefaultElements$().subscribe((elements) => {
      this.state.set({
        areChanges: false,
        elements: this.elementsToMap(elements),
      });
    });
  }

  private readonly sideEffects = rxEffects(({ register }) => {
    // Keep the local storage in sync with the state
    register(this.areChanges$, (areChanges) => {
      if (areChanges) {
        this.localStorageService.setItem(ARE_CHANGES_KEY, true);
      } else {
        this.localStorageService.removeItem(ARE_CHANGES_KEY);
      }
    });

    // Keep the IndexedDB in sync with the state
    // Potentially, we could asynchronously 'put' only the element that is changed via 'updateElement' as we don't expose the state from the service. This way would be more efficient than bulk putting all elements on every change, but for now it doesn't seem necessary.
    register(this.elements$, (elements) => {
      indexedDB.elements.bulkPut(elements);
    });
  });

  private elementsToMap(elements: PeriodicElement[]): PeriodicElementsMap {
    return elements.reduce(
      (acc, element) => ({ ...acc, [element.id]: element }),
      {} as PeriodicElementsMap,
    );
  }
}
