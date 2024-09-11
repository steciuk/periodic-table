import { inject, Injectable } from '@angular/core';
import { ElementsProviderService } from './elements-provider/elements-provider.service';

@Injectable()
export class ElementsService {
  private readonly elementsProvider = inject(ElementsProviderService);

  get$() {
    return this.elementsProvider.getAll$();
  }
}
