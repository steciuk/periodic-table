import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { combineLatestWith, map, Observable } from 'rxjs';
import { PeriodicElement, Phase } from '../types/PeriodicElement';
import { ElementsService } from '../services/elements.service';
import { FindMatchesService } from '../services/find-matches.service';
import { FilterMatches } from '../types/utils';
import { CommonModule } from '@angular/common';
import { ElementMarkValueMatchComponent } from './element-mark-value-match.component';
import { MatDialog } from '@angular/material/dialog';
import { ElementDialogComponent } from './element-dialog.component';

@Component({
  selector: 'app-elements-grid',
  standalone: true,
  imports: [CommonModule, ElementMarkValueMatchComponent],
  host: { class: 'overflow-x-auto block' },
  template: `
    @let isFilter = filterValue$ && (filterValue$ | async) !== '';
    <div
      class="main-grid m-auto grid w-full min-w-[1200px] max-w-[1600px] py-4"
    >
      <ul
        class="col-span-8 col-start-4 row-span-3 row-start-1 m-0 grid place-content-center gap-2"
      >
        @for (phaseColor of PHASE_COLOR_MAP | keyvalue; track phaseColor.key) {
          <li class="flex list-inside list-none items-center gap-1">
            <div
              class="h-5 w-12 rounded-sm"
              [ngStyle]="{ backgroundColor: phaseColor.value }"
            ></div>
            -
            <span>{{ phaseColor.key }}</span>
          </li>
        }
      </ul>
      @for (
        elementWithMatches of elementsWithMatches$ | async;
        track elementWithMatches.element.id
      ) {
        @let element = elementWithMatches.element;
        @let filterMatch = elementWithMatches.filterMatches;
        <button
          class="flex cursor-pointer flex-col justify-between border border-solid border-slate-700 p-1 text-left text-inherit"
          [ngClass]="{
            'opacity-20': isFilter && !areMatches(filterMatch),
          }"
          [ngStyle]="{
            gridColumn: element.xpos,
            gridRow: element.ypos,
            backgroundColor: PHASE_COLOR_MAP[element.phase],
          }"
          (click)="onCellClick(element)"
          [ariaLabel]="element.name"
        >
          <app-element-mark-value-match
            class="m-0 text-base leading-none"
            [value]="element.number"
            [filterMatch]="filterMatch.number"
          />
          <app-element-mark-value-match
            class="m-0 text-xl font-bold leading-none"
            [value]="element.symbol"
            [filterMatch]="filterMatch.symbol"
          />
          <app-element-mark-value-match
            class="m-0 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-xs leading-none tracking-tighter"
            [value]="element.name"
            [filterMatch]="filterMatch.name"
          />
          <app-element-mark-value-match
            class="m-0 text-xs leading-none"
            [value]="element.atomic_mass | number: ATOMIC_MASS_DECIMALS_PATTERN"
            [filterMatch]="filterMatch.atomic_mass"
          />
        </button>
      }
    </div>
  `,
  styles: `
    .main-grid {
      grid-template-columns: repeat(18, minmax(0, 1fr));
      grid-template-rows: repeat(10, 75px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementsGridComponent implements OnInit {
  @Input() filterValue$?: Observable<string>;

  private readonly elementsService = inject(ElementsService);
  private readonly findMatchesService = inject(FindMatchesService);
  private readonly dialog = inject(MatDialog);
  private readonly injector = inject(Injector);

  private readonly searchKeys = [
    'number',
    'name',
    'symbol',
    'atomic_mass',
  ] as const satisfies (keyof PeriodicElement)[];

  protected readonly ATOMIC_MASS_DECIMALS = 3;
  protected readonly ATOMIC_MASS_DECIMALS_PATTERN = `1.0-${this.ATOMIC_MASS_DECIMALS}`;
  protected readonly PHASE_COLOR_MAP = {
    [Phase.Solid]: '#27272a',
    [Phase.Liquid]: '#1e3a8a',
    [Phase.Gas]: '#14532d',
  } as const satisfies { [key in Phase]: string };

  protected elementsWithMatches$: Observable<
    {
      element: PeriodicElement;
      filterMatches: FilterMatches<PeriodicElement>;
    }[]
  > = this.elementsService
    .getAll$()
    .pipe(
      map((elements) =>
        elements.map((element) => ({ element, filterMatches: {} })),
      ),
    );

  ngOnInit(): void {
    if (this.filterValue$ !== undefined) {
      this.elementsWithMatches$ = this.elementsService.getAll$().pipe(
        combineLatestWith(this.filterValue$),
        map(([elements, filterValue]) => {
          return elements.map((element) => ({
            element,
            filterMatches: this.findMatchesService.findMatches(
              // Round atomic mass for filter matcher, cause there are less decimals displayed in the grid and we don't want to match on something that is not displayed
              {
                ...element,
                atomic_mass:
                  Math.round(
                    element.atomic_mass * 10 ** this.ATOMIC_MASS_DECIMALS,
                  ) /
                  10 ** this.ATOMIC_MASS_DECIMALS,
              },
              this.searchKeys,
              filterValue,
            ),
          }));
        }),
      );
    }
  }

  protected areMatches(filterMatches: FilterMatches<PeriodicElement>) {
    return Object.keys(filterMatches).length > 0;
  }

  protected onCellClick(element: PeriodicElement) {
    this.dialog.open(ElementDialogComponent, {
      data: element,
      injector: this.injector,
    });
  }
}
