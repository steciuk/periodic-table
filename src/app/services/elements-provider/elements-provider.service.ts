import { Observable } from 'rxjs';
import { PeriodicElement } from '../../types/PeriodicElement';

export abstract class ElementsProviderService {
  abstract getAll$(): Observable<PeriodicElement[]>;
  abstract update(element: PeriodicElement): void;
}
