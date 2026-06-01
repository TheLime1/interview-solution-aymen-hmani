import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StatusFilter, UserFilters, UserStatus } from '../../../models/user.model';

@Component({
  selector: 'app-user-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-filters.component.html',
  styleUrl: './user-filters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFiltersComponent {
  @Input({ required: true }) filters!: UserFilters;
  @Input({ required: true }) roles!: string[];
  @Input({ required: true }) departments!: string[];
  @Input({ required: true }) statuses!: UserStatus[];

  @Output() filtersChange = new EventEmitter<UserFilters>();
  @Output() resetFilters = new EventEmitter<void>();

  updateSearchTerm(searchTerm: string): void {
    this.emitFilters({ searchTerm });
  }

  updateRole(selectedRole: string): void {
    this.emitFilters({ selectedRole });
  }

  updateDepartment(selectedDepartment: string): void {
    this.emitFilters({ selectedDepartment });
  }

  updateStatus(selectedStatus: StatusFilter): void {
    this.emitFilters({ selectedStatus });
  }

  private emitFilters(filters: Partial<UserFilters>): void {
    this.filtersChange.emit({
      ...this.filters,
      ...filters
    });
  }
}

