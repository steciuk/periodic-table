import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ElementsTableComponent } from './components/elements-table.component';
import { ElementsService } from './services/elements.service';
import { ElementsProviderMockService } from './services/elements-provider/elements-provider-mock.service';
import { ElementsProviderService } from './services/elements-provider/elements-provider.service';
import { ClearableInputComponent } from './components/clearable-input.component';
import { BehaviorSubject, debounceTime, startWith } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { ElementsGridComponent } from './components/elements-grid.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from './components/base.component';
import { MatTooltipModule } from '@angular/material/tooltip';

const FILTER_DEBOUNCE_TIME = 2000;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ElementsTableComponent,
    ClearableInputComponent,
    MatTabsModule,
    ElementsGridComponent,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  providers: [
    ElementsService,
    {
      provide: ElementsProviderService,
      useClass: ElementsProviderMockService,
    },
  ],
  template: `<div class="flex min-h-screen flex-col">
    <header class="mb-8 flex flex-wrap justify-between gap-4 px-4 pt-4">
      <h1 class="m-0">Periodic Table</h1>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <button
          mat-stroked-button
          matTooltip="Reverts all changes made to the elements data, i.e. their names, symbols, weights, etc."
          (click)="onDiscardChanges()"
          [disabled]="!areChanges"
        >
          Revert all changes
        </button>
        <app-clearable-input
          label="Filter"
          (valueChange)="onFilterValueChange($event)"
        />
      </div>
    </header>
    <main class="flex-grow px-4">
      <mat-tab-group dynamicHeight>
        <mat-tab label="Table">
          <app-elements-table [filterValue$]="debouncedFilterValue$" />
        </mat-tab>
        <mat-tab label="Grid">
          <app-elements-grid [filterValue$]="debouncedFilterValue$" />
        </mat-tab>
      </mat-tab-group>
    </main>
    <footer class="mt-8 pb-4 text-center text-gray-500">
      <span>Made by </span>
      <a href="https://steciuk.dev/" target="_blank" rel="noopener"
        >Adam Steciuk</a
      >
    </footer>
  </div>`,
})
export class AppComponent extends BaseComponent implements OnInit {
  protected readonly filterValue$ = new BehaviorSubject<string>('');
  private readonly elementsService = inject(ElementsService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly debouncedFilterValue$ = this.filterValue$
    .asObservable()
    .pipe(
      debounceTime(FILTER_DEBOUNCE_TIME),
      // Do not wait for the first value to start filtering
      startWith(''),
    );

  protected areChanges = false;

  ngOnInit() {
    this.subs.sink = this.elementsService
      .getAreChanges$()
      .subscribe((areChanges) => {
        // Real update
        this.areChanges = areChanges;
        this.cdr.markForCheck();
      });
  }

  protected onFilterValueChange(value: string) {
    this.filterValue$.next(value);
  }

  protected onDiscardChanges() {
    this.elementsService.discardChanges();
    // Optimistic update
    this.areChanges = false;
  }
}
