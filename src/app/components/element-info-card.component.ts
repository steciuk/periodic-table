import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PeriodicElement } from '../types/PeriodicElement';

@Component({
  selector: 'app-element-info-card',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <div class="p-4">
        <div class="flex justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="text-5xl">{{ element.number }}</div>
            <div>
              <mat-card-title>{{ element.name }}</mat-card-title>
              <mat-card-subtitle>
                {{ element.symbol }}
              </mat-card-subtitle>
            </div>
          </div>
          <div class="text-right">
            <mat-card-subtitle class="text-balance"
              >{{ element.phase }}, {{ element.category }}</mat-card-subtitle
            >
            <mat-card-subtitle>{{ element.atomic_mass }}</mat-card-subtitle>
          </div>
        </div>
      </div>
      <div class="overflow-auto">
        <img
          [src]="element.image.url"
          [alt]="element.image.title"
          class="aspect-square w-full object-cover"
        />
        <mat-card-content class="pb-0">
          <p class="text-justify">
            {{ element.summary }}
          </p>
          <a
            [href]="element.source"
            target="_blank"
            rel="noopener noreferrer"
            class="mx-auto block w-max"
            >Learn more</a
          >
        </mat-card-content>
      </div>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementInfoCardComponent {
  @Input({ required: true }) element!: PeriodicElement;
}
