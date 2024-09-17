import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PeriodicElement, Phase } from '../types/PeriodicElement';
import { CommonModule } from '@angular/common';
import { ElementMarkValueMatchComponent } from './element-mark-value-match.component';
import { LoadingComponent } from './loading.component';
import {
  ElementsViewComponent,
  PeriodicElementWIthMatches,
} from './elements-view.component';
import { FindMatchesService } from '../services/find-matches.service';
import { RxLet } from '@rx-angular/template/let';

@Component({
  selector: 'app-elements-grid',
  standalone: true,
  imports: [
    CommonModule,
    ElementMarkValueMatchComponent,
    LoadingComponent,
    RxLet,
  ],
  host: { class: 'overflow-x-auto block' },
  template: `
    <div
      class="main-grid m-auto grid w-full min-w-[1200px] max-w-[1600px] gap-0.5 py-4"
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
      <ng-container *rxLet="matchData$; let matchData; suspense: loading">
        @for (
          elementWithMatches of matchData.elementsWithMatches;
          track elementWithMatches.element.id
        ) {
          @let element = elementWithMatches.element;
          @let filterMatch = elementWithMatches.filterMatches;
          <button
            class="flex cursor-pointer flex-col justify-between border-none p-1 text-left text-inherit"
            [ngClass]="{
              'opacity-20':
                matchData.filterValue !== '' &&
                (filterMatch | keyvalue).length === 0,
            }"
            [ngStyle]="{
              gridColumn: element.xpos,
              gridRow: element.ypos,
              backgroundColor: PHASE_COLOR_MAP[element.phase],
            }"
            (click)="openDialog(element)"
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
              [value]="
                element.atomic_mass | number: ATOMIC_MASS_DECIMALS_PATTERN
              "
              [filterMatch]="filterMatch.atomic_mass"
            />
          </button>
        }
      </ng-container>
    </div>

    <ng-template #loading>
      <app-loading />
    </ng-template>
  `,
  styles: `
    .main-grid {
      grid-template-columns: repeat(18, minmax(0, 1fr));
      grid-template-rows: repeat(10, 75px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementsGridComponent extends ElementsViewComponent {
  private readonly findMatchesService = inject(FindMatchesService);
  protected readonly USED_KEYS = [
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

  // 'filterValue' is used to fade out elements that don't have matches if filter is applied. It would be more readable not to combine 'elementsWithMatches' and 'filterValue' into one final stream, and 'async' pipe them separately in the template, but this results in brief flashing of the grid on filter changes, due to filterValue arriving a touch earlier.
  protected readonly matchData$: Observable<{
    elementsWithMatches: PeriodicElementWIthMatches[];
    filterValue: string;
  }> = this.elementsWithFilter$.pipe(
    map(([elements, filterValue]) => ({
      elementsWithMatches: elements.map((element) => ({
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
          this.USED_KEYS,
          filterValue,
        ),
      })),
      filterValue,
    })),
  );
}
