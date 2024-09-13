import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PeriodicElement, Phase } from '../types/PeriodicElement';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ElementsService } from '../services/elements.service';

@Component({
  selector: 'app-element-edit-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <div class="w-full p-4">
      <form
        [formGroup]="elementForm"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <mat-form-field subscriptSizing="dynamic" appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" autocomplete="off" />

          @let nameErrors = elementForm.get('name')?.errors;
          @if (nameErrors?.['required']) {
            <mat-error>Name is required</mat-error>
          } @else if (nameErrors?.['maxlength']) {
            <mat-error>Name must be less than 20 characters</mat-error>
          }
        </mat-form-field>
        <mat-form-field subscriptSizing="dynamic" appearance="outline">
          <mat-label>Symbol</mat-label>
          <input matInput formControlName="symbol" />

          @let symbolErrors = elementForm.get('symbol')?.errors;
          @if (symbolErrors?.['required']) {
            <mat-error>Symbol is required</mat-error>
          } @else if (symbolErrors?.['maxlength']) {
            <mat-error>Symbol must be less than 3 characters</mat-error>
          } @else if (symbolErrors?.['pattern']) {
            <mat-error
              >Symbol must must contain only letters and start with a
              capital</mat-error
            >
          }
        </mat-form-field>
        <mat-form-field subscriptSizing="dynamic" appearance="outline">
          <mat-label>Number</mat-label>
          <input matInput formControlName="number" />

          @let numerErrors = elementForm.get('number')?.errors;
          @if (numerErrors?.['required']) {
            <mat-error>Number is required</mat-error>
          } @else if (numerErrors?.['min']) {
            <mat-error>Number must be greater than 0</mat-error>
          } @else if (numerErrors?.['pattern']) {
            <mat-error>Number must be an integer</mat-error>
          }
        </mat-form-field>
        <mat-form-field subscriptSizing="dynamic" appearance="outline">
          <mat-label>Phase</mat-label>
          <mat-select formControlName="phase">
            @for (phase of phases; track phase) {
              <mat-option [value]="phase">
                {{ phase }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field subscriptSizing="dynamic" appearance="outline">
          <mat-label>Category</mat-label>
          <input matInput formControlName="category" />
        </mat-form-field>
        <mat-form-field subscriptSizing="dynamic" appearance="outline">
          <mat-label>Atomic Mass</mat-label>
          <input matInput formControlName="atomic_mass" />

          @let massErrors = elementForm.get('atomic_mass')?.errors;
          @if (massErrors?.['required']) {
            <mat-error>Atomic mass is required</mat-error>
          } @else if (massErrors?.['min']) {
            <mat-error>Atomic mass must be greater than 0</mat-error>
          }
        </mat-form-field>

        <mat-form-field
          subscriptSizing="dynamic"
          class="sm:col-span-2"
          appearance="outline"
        >
          <mat-label>Summary</mat-label>
          <textarea matInput formControlName="summary"></textarea>
        </mat-form-field>
      </form>
      <mat-dialog-actions
        class="flex flex-col items-center sm:flex-row sm:justify-between"
      >
        <button mat-button (click)="cancel.emit()">Cancel</button>
        <button mat-button [disabled]="elementForm.invalid" (click)="onSave()">
          I'm a physicist, save changes
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: `
    input[type='number'] {
      appearance: textfield;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementEditFormComponent implements OnInit {
  private readonly elementsService = inject(ElementsService);

  @Input({ required: true }) element!: PeriodicElement;
  @Output() readonly cancel = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<PeriodicElement>();

  protected readonly phases = Object.values(Phase);
  protected elementForm = this.createFormGroup();

  ngOnInit(): void {
    this.elementForm = this.createFormGroup();
  }

  protected onSave() {
    if (this.elementForm.invalid) {
      return;
    }

    const newElement = {
      ...this.element,
      ...this.elementForm.value,
    } as PeriodicElement;

    this.save.emit(newElement);
    this.elementsService.update(newElement);
  }

  private createFormGroup() {
    if (!this.element) {
      return new FormGroup({}) as unknown as typeof formGroup;
    }

    const formGroup = new FormGroup({
      number: new FormControl(this.element.number, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^\d+$/),
      ]),
      name: new FormControl(this.element.name, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      symbol: new FormControl(this.element.symbol, [
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern(/^[A-Z][a-z]*$/),
      ]),
      phase: new FormControl(this.element.phase, [Validators.required]),
      category: new FormControl(this.element.category),
      atomic_mass: new FormControl(this.element.atomic_mass, [
        Validators.required,
        Validators.min(1),
      ]),
      summary: new FormControl(this.element.summary),
    });

    return formGroup;
  }
}
