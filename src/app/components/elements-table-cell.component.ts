import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PeriodicElement } from '../types/PeriodicElement';

type ValueWitMatches = {
  value: string;
  startIndex: number;
  endIndex: number;
};
export type SimpleValueOrWithMatches =
  | PeriodicElement[keyof PeriodicElement]
  | ValueWitMatches;

@Component({
  selector: 'app-elements-table-cell-content',
  standalone: true,
  imports: [MatTableModule],
  template: `
    @if (isWithMatches(elementValue)) {
    <span class="flex">
      {{ elementValue.value.substring(0, elementValue.startIndex) }}
      <mark>{{
        elementValue.value.substring(
          elementValue.startIndex,
          elementValue.endIndex
        )
      }}</mark>
      {{ elementValue.value.substring(elementValue.endIndex) }}
    </span>
    } @else {
    <span>{{ elementValue }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementsTableCellContentComponent {
  @Input({ required: true }) elementValue!: SimpleValueOrWithMatches;

  protected isWithMatches(
    value: SimpleValueOrWithMatches
  ): value is ValueWitMatches {
    return (
      !!value &&
      typeof value === 'object' &&
      'startIndex' in value &&
      'endIndex' in value
    );
  }
}
