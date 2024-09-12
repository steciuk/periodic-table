import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { PeriodicElement } from '../types/PeriodicElement';
import { MatButton } from '@angular/material/button';
import { ElementInfoCardComponent } from './element-info-card.component';
import { ElementEditFormComponent } from './element-edit-form.component';
import { BaseComponent } from './base.component';
import { ElementsService } from '../services/elements.service';

@Component({
  selector: 'app-element-details-dialog',
  standalone: true,
  imports: [
    MatButton,
    ElementInfoCardComponent,
    MatDialogActions,
    ElementEditFormComponent,
  ],
  template: `
    <div class="max-h-screen grid grid-rows-[1fr_auto] w-[min(560px,_100vw)]">
      <div class="max-h-full overflow-auto">
        @if(isEditMode) {
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
export class ElementDialogComponent extends BaseComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ElementDialogComponent>);
  private readonly elementsService = inject(ElementsService);
  private readonly cdr = inject(ChangeDetectorRef);
  element = inject<PeriodicElement>(MAT_DIALOG_DATA);

  protected isEditMode = false;

  ngOnInit(): void {
    this.subs.sink = this.elementsService
      .get$(this.element.id)
      .subscribe((element) => {
        if (element) {
          // Real update
          this.element = element;
          this.cdr.detectChanges();
        }
      });
  }

  protected formSaved(element: PeriodicElement) {
    this.isEditMode = false;
    // Optimistic update
    this.element = element;
  }
}
