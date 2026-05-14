import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent {

  @Input() label = '';
  @Input() type = 'text';
  @Input() control!: AbstractControl;

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  getError(): string {
    if (!this.control || !this.control.errors) return '';

    if (this.control.hasError('required')) return 'Required';
    if (this.control.hasError('email')) return 'Invalid email';
    if (this.control.hasError('minlength')) return 'Too short';

    return 'Invalid field';
  }
}