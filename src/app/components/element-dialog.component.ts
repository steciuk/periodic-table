import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { PeriodicElement } from '../types/PeriodicElement';
import { MatButton } from '@angular/material/button';
import { ElementInfoCardComponent } from './element-info-card.component';
import { ElementEditFormComponent } from './element-edit-form.component';
import { ElementsService } from '../services/elements.service';
import { merge, startWith, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-element-details-dialog',
  standalone: true,
  imports: [
    MatButton,
    ElementInfoCardComponent,
    MatDialogActions,
    ElementEditFormComponent,
    AsyncPipe,
  ],
  template: `
    <div
      class="grid max-h-screen min-w-[min(560px,_90vw)] grid-rows-[1fr_auto]"
    >
      @let element = (element$ | async)!;
      <div class="max-h-full overflow-auto">
        @if (isEditMode) {
          <app-element-edit-form
            class="flex"
            [element]="element"
            (cancel)="isEditMode = false"
            (save)="formSaved($event)"
          />
        } @else {
          <app-element-info-card [element]="element" />
        }
      </div>
      @if (!isEditMode) {
        <mat-dialog-actions class="flex justify-between">
          <button mat-button (click)="dialogRef.close()">Close</button>
          <button mat-button (click)="isEditMode = true">Edit</button>
        </mat-dialog-actions>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ElementDialogComponent>);
  private readonly elementsService = inject(ElementsService);
  private readonly element = inject<PeriodicElement>(MAT_DIALOG_DATA);

  protected isEditMode = false;
  protected readonly elementFromForm$ = new Subject<PeriodicElement>();
  protected readonly element$ = merge(
    // Optimistic update
    this.elementFromForm$,
    // Real update
    this.elementsService.get$(this.element.id),
  ).pipe(startWith(this.element));

  protected formSaved(element: PeriodicElement) {
    this.isEditMode = false;
    this.elementFromForm$.next(element);
  }
}
