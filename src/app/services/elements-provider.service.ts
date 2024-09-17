import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { PeriodicElement } from '../types/PeriodicElement';
import { catchError, map, Observable, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElementsProviderService {
  private readonly http = inject(HttpService);

  getDefaultElements$(): Observable<PeriodicElement[]> {
    return this.http
      .get<{ elements: Omit<PeriodicElement, 'id'>[] }>('elements.json')
      .pipe(
        map(({ elements }) =>
          elements.map((element) => ({ ...element, id: element.number })),
        ),
        take(1),
        catchError((err) => {
          console.error(err);
          return of([]);
        }),
      );
  }
}
