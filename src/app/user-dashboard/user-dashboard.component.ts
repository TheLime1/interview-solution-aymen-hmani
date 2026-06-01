import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { USER_DEPARTMENTS, USER_ROLES, USER_STATUSES } from '../data/user-options';
import {
  StatusFilter,
  User,
  UserDraft,
  UserFilters,
  UserForm,
  UserSortField,
  UserStatus
} from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserFiltersComponent } from './components/user-filters/user-filters.component';
import { UserFormModalComponent } from './components/user-form-modal/user-form-modal.component';
import { UserPaginationComponent } from './components/user-pagination/user-pagination.component';
import { UserStatsComponent } from './components/user-stats/user-stats.component';
import { UserTableComponent } from './components/user-table/user-table.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UserStatsComponent,
    UserFiltersComponent,
    UserTableComponent,
    UserPaginationComponent,
    UserFormModalComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly trimmedRequiredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (typeof value === 'string' && value.trim().length === 0) {
      return { required: true };
    }

    return null;
  };

  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly emailFormatValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (typeof value !== 'string' || value.trim().length === 0) {
      return null;
    }

    return this.emailPattern.test(value.trim()) ? null : { pattern: true };
  };

  users: User[] = [];
  displayedUsers: User[] = [];
  paginatedUsers: User[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  filters: UserFilters = {
    searchTerm: '',
    selectedRole: 'all',
    selectedDepartment: 'all',
    selectedStatus: 'all'
  };

  sortField: UserSortField = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  showForm: boolean = false;
  isEditing: boolean = false;
  formSubmitted: boolean = false;
  currentUser: UserDraft = this.getEmptyUser();
  userForm: UserForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [this.trimmedRequiredValidator]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [this.trimmedRequiredValidator, this.emailFormatValidator]
    }),
    role: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    department: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    status: new FormControl<UserStatus | ''>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;

  roles: string[] = USER_ROLES;
  departments: string[] = USER_DEPARTMENTS;
  statuses: UserStatus[] = USER_STATUSES;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.applyFiltersAndSort();
      this.calculateStatistics();
    });
  }

  updateFilters(filters: UserFilters): void {
    this.filters = filters;
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let filtered = [...this.users];
    const { searchTerm, selectedRole, selectedDepartment, selectedStatus } = this.filters;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(user => user.department === selectedDepartment);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    filtered.sort((a, b) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];

      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.displayedUsers = filtered;
    this.totalPages = Math.ceil(this.displayedUsers.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.displayedUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  sortBy(field: UserSortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  calculateStatistics(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(user => user.status === 'active').length;
    this.inactiveUsers = this.users.filter(user => user.status === 'inactive').length;
  }

  openAddForm(): void {
    this.isEditing = false;
    this.currentUser = this.getEmptyUser();
    this.resetUserForm(this.currentUser);
    this.showForm = true;
  }

  openEditForm(user: User): void {
    this.isEditing = true;
    this.currentUser = { ...user };
    this.resetUserForm(this.currentUser);
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.formSubmitted = false;
    this.currentUser = this.getEmptyUser();
    this.resetUserForm(this.currentUser);
  }

  saveUser(): void {
    this.formSubmitted = true;

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();
    const userToSave: User = {
      id: this.currentUser.id,
      name: formValue.name.trim(),
      email: formValue.email.trim(),
      role: formValue.role,
      status: formValue.status as UserStatus,
      joinDate: this.currentUser.joinDate,
      department: formValue.department
    };

    if (this.isEditing) {
      const index = this.users.findIndex(user => user.id === userToSave.id);
      if (index !== -1) {
        this.users[index] = userToSave;
      }
    } else {
      const newId = Math.max(...this.users.map(user => user.id), 0) + 1;
      this.users.push({
        ...userToSave,
        id: newId,
        joinDate: new Date()
      });
    }

    this.applyFiltersAndSort();
    this.calculateStatistics();
    this.closeForm();
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(user => user.id !== userId);
      this.applyFiltersAndSort();
      this.calculateStatistics();
    }
  }

  toggleUserStatus(user: User): void {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    this.applyFiltersAndSort();
    this.calculateStatistics();
  }

  getEmptyUser(): UserDraft {
    return {
      id: 0,
      name: '',
      email: '',
      role: '',
      status: '',
      joinDate: new Date(),
      department: ''
    };
  }

  resetUserForm(user: UserDraft): void {
    this.formSubmitted = false;
    this.userForm.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    });
  }

  resetFilters(): void {
    this.filters = {
      searchTerm: '',
      selectedRole: 'all',
      selectedDepartment: 'all',
      selectedStatus: 'all'
    };
    this.applyFiltersAndSort();
  }
}

