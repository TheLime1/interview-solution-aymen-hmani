import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UserForm } from '../../../models/user.model';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormModalComponent {
  @Input({ required: true }) isEditing!: boolean;
  @Input({ required: true }) formSubmitted!: boolean;
  @Input({ required: true }) userForm!: UserForm;
  @Input({ required: true }) roles!: string[];
  @Input({ required: true }) departments!: string[];

  @Output() saveUser = new EventEmitter<void>();
  @Output() closeForm = new EventEmitter<void>();

  isFieldInvalid(fieldName: keyof UserForm['controls']): boolean {
    const control = this.userForm.controls[fieldName];

    return control.invalid && (control.touched || this.formSubmitted);
  }

  hasFieldError(fieldName: keyof UserForm['controls'], errorName: string): boolean {
    const control = this.userForm.controls[fieldName];

    return control.hasError(errorName) && (control.touched || this.formSubmitted);
  }
}

