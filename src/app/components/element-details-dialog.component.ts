import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PeriodicElement } from '../types/PeriodicElement';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-element-details-dialog',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <mat-card class="max-h-screen">
      <div class="p-4">
        <div class="flex justify-between">
          <div>
            <mat-card-title>{{ data.name }}</mat-card-title>
            <mat-card-subtitle>
              {{ data.symbol }}
            </mat-card-subtitle>
          </div>
          <div class="text-right">
            <mat-card-subtitle>{{ data.category }}</mat-card-subtitle>
            <mat-card-subtitle>{{ data.atomic_mass }}</mat-card-subtitle>
          </div>
        </div>
      </div>
      <div class="overflow-auto">
        <img
          [src]="data.image.url"
          [alt]="data.image.title"
          class="object-cover w-full aspect-square"
        />
        <mat-card-content>
          <p class="text-justify">
            {{ data.summary }}
          </p>
        </mat-card-content>
        <mat-card-actions class="flex justify-between">
          <button mat-button (click)="dialogRef.close()">Close</button>
        </mat-card-actions>
      </div>
    </mat-card>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementDetailsDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ElementDetailsDialogComponent>);
  readonly data = inject<PeriodicElement>(MAT_DIALOG_DATA);
}
