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
import { RxLet } from '@rx-angular/template/let';

@Component({
  selector: 'app-element-details-dialog',
  standalone: true,
  imports: [
    MatButton,
    ElementInfoCardComponent,
    MatDialogActions,
    ElementEditFormComponent,
    RxLet,
  ],
  template: `
    <div
      class="grid max-h-screen min-w-[min(560px,_90vw)] grid-rows-[1fr_auto]"
    >
      <div class="max-h-full overflow-auto">
        <ng-container *rxLet="element$; let element">
          @if (!element) {
            <p class="text-center">Element not found</p>
          } @else if (isEditMode) {
            <app-element-edit-form
              class="flex"
              [element]="element"
              (cancel)="isEditMode = false"
              (save)="formSaved()"
            />
          } @else {
            <app-element-info-card [element]="element" />
          }
        </ng-container>
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
  private readonly elementId = inject<PeriodicElement['id']>(MAT_DIALOG_DATA);

  protected isEditMode = false;
  protected readonly element$ = this.elementsService.getElement$(
    this.elementId,
  );

  protected formSaved() {
    this.isEditMode = false;
  }
}
