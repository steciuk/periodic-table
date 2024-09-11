import { Component } from '@angular/core';
import { ElementsTableComponent } from './components/elements-table.component';
import { ElementsService } from './services/elements.service';
import { ElementsProviderMockService } from './services/elements-provider/elements-provider-mock.service';
import { ElementsProviderService } from './services/elements-provider/elements-provider.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ElementsTableComponent],
  providers: [
    ElementsService,
    {
      provide: ElementsProviderService,
      useClass: ElementsProviderMockService,
    },
  ],
  template: `<app-elements-table />`,
})
export class AppComponent {}
