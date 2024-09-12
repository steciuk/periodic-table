import { inject, Injectable } from '@angular/core';
import { ElementsProviderService } from './elements-provider/elements-provider.service';
import { PeriodicElement } from '../types/PeriodicElement';

@Injectable()
export class ElementsService {
  private readonly elementsProvider = inject(ElementsProviderService);

  get$(id: number) {
    return this.elementsProvider.get$(id);
  }

  getAll$() {
    return this.elementsProvider.getAll$();
  }

  update(element: PeriodicElement) {
    this.elementsProvider.update(element);
  }
}
