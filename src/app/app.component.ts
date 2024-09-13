import { Component } from '@angular/core';
import { ElementsTableComponent } from './components/elements-table.component';
import { ElementsService } from './services/elements.service';
import { ElementsProviderMockService } from './services/elements-provider/elements-provider-mock.service';
import { ElementsProviderService } from './services/elements-provider/elements-provider.service';
import { ClearableInputComponent } from './components/clearable-input.component';
import { BehaviorSubject, debounceTime, startWith } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { ElementsGridComponent } from './components/elements-grid.component';

const FILTER_DEBOUNCE_TIME = 2000;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ElementsTableComponent,
    ClearableInputComponent,
    MatTabsModule,
    ElementsGridComponent,
  ],
  providers: [
    ElementsService,
    {
      provide: ElementsProviderService,
      useClass: ElementsProviderMockService,
    },
  ],
  template: `<div class="p-4">
    <header class="flex justify-between">
      <h1>Periodic Table</h1>
      <app-clearable-input
        label="Filter"
        (valueChange)="onFilterValueChange($event)"
      />
    </header>
    <main>
      <mat-tab-group dynamicHeight>
        <mat-tab label="Table">
          <app-elements-table [filterValue$]="debouncedFilterValue$" />
        </mat-tab>
        <mat-tab label="Grid">
          <app-elements-grid [filterValue$]="debouncedFilterValue$" />
        </mat-tab>
      </mat-tab-group>
    </main>
  </div>`,
})
export class AppComponent {
  protected readonly filterValue$ = new BehaviorSubject<string>('');
  protected readonly debouncedFilterValue$ = this.filterValue$
    .asObservable()
    .pipe(
      debounceTime(FILTER_DEBOUNCE_TIME),
      // Do not wait for the first value to start filtering
      startWith(''),
    );

  protected onFilterValueChange(value: string) {
    this.filterValue$.next(value);
  }
}
