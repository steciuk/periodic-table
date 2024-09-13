import { inject, Injectable } from '@angular/core';
import { ElementsProviderService } from './elements-provider/elements-provider.service';
import { PeriodicElement } from '../types/PeriodicElement';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

const ARE_CHANGES_KEY = 'are-changes';

// All methods should have error handling, as the provider (normally http) could fail.
@Injectable()
export class ElementsService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly elementsProvider = inject(ElementsProviderService);
  private readonly areChanges$: BehaviorSubject<boolean>;

  constructor() {
    // Normally, this would be stored on the server
    const areChanges =
      this.localStorageService.getItem<boolean>(ARE_CHANGES_KEY);
    this.areChanges$ = new BehaviorSubject<boolean>(areChanges ? true : false);
  }

  getAll$() {
    // Normally, this would return a single value and complete, and we would have to implement a stream, that would reemit the data when changes through `update` are made and successful, practically reimplementing Dexie's liveQuery.
    return this.elementsProvider.getAll$();
  }

  get$(id: number) {
    // Same as above
    return this.elementsProvider.get$(id);
  }

  update(element: PeriodicElement) {
    this.elementsProvider.update$(element).subscribe({
      complete: () => {
        this.localStorageService.setItem(ARE_CHANGES_KEY, true);
        this.areChanges$.next(true);
      },
    });
  }

  discardChanges() {
    this.elementsProvider.discardChanges$().subscribe({
      complete: () => {
        this.localStorageService.removeItem(ARE_CHANGES_KEY);
        this.areChanges$.next(false);
      },
    });
  }

  getAreChanges$() {
    return this.areChanges$.asObservable().pipe(distinctUntilChanged());
  }
}
