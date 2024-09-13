import { Observable } from 'rxjs';
import { PeriodicElement } from '../../types/PeriodicElement';

export abstract class ElementsProviderService {
  abstract get$(id: number): Observable<PeriodicElement | undefined>;
  abstract getAll$(): Observable<PeriodicElement[]>;
  abstract update$(element: PeriodicElement): Observable<number>;
  abstract discardChanges$(): Observable<void>;
}
