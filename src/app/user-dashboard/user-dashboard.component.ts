import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

// User interface
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: Date;
  department: string;
}

type UserDraft = Omit<User, 'status'> & {
  status: User['status'] | '';
};

type UserForm = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<string>;
  department: FormControl<string>;
  status: FormControl<User['status'] | ''>;
}>;

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
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

  // All users data
  users: User[] = [];

  // Filtered and sorted users for display
  displayedUsers: User[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  paginatedUsers: User[] = [];

  // Filtering
  searchTerm: string = '';
  selectedRole: string = 'all';
  selectedDepartment: string = 'all';
  selectedStatus: User['status'] | 'all' = 'all';

  // Sorting
  sortField: keyof User = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Form for adding/editing users
  showForm: boolean = false;
  isEditing: boolean = false;
  formSubmitted: boolean = false;
  currentUser!: UserDraft;
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
    status: new FormControl<User['status'] | ''>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  // Statistics
  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;

  // Available options for filters
  roles: string[] = ['Admin', 'Manager', 'Developer', 'Designer', 'Analyst'];
  departments: string[] = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  statuses: string[] = ['active', 'inactive'];


  ngOnInit(): void {
    this.currentUser = this.getEmptyUser();
    this.loadMockData();
    this.applyFiltersAndSort();
    this.calculateStatistics();
  }

  // Load mock data
  loadMockData(): void {
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
        status: 'active',
        joinDate: new Date('2023-01-15'),
        department: 'Engineering'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'Developer',
        status: 'active',
        joinDate: new Date('2023-03-20'),
        department: 'Engineering'
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        role: 'Manager',
        status: 'active',
        joinDate: new Date('2022-11-10'),
        department: 'Marketing'
      },
      {
        id: 4,
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        role: 'Designer',
        status: 'inactive',
        joinDate: new Date('2023-05-05'),
        department: 'Marketing'
      },
      {
        id: 5,
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        role: 'Analyst',
        status: 'active',
        joinDate: new Date('2023-07-12'),
        department: 'Finance'
      },
      {
        id: 6,
        name: 'Diana Prince',
        email: 'diana.prince@example.com',
        role: 'Developer',
        status: 'active',
        joinDate: new Date('2023-02-28'),
        department: 'Engineering'
      },
      {
        id: 7,
        name: 'Ethan Hunt',
        email: 'ethan.hunt@example.com',
        role: 'Manager',
        status: 'active',
        joinDate: new Date('2022-09-15'),
        department: 'Sales'
      },
      {
        id: 8,
        name: 'Fiona Green',
        email: 'fiona.green@example.com',
        role: 'Developer',
        status: 'inactive',
        joinDate: new Date('2023-04-18'),
        department: 'Engineering'
      }
    ];
    this.applyFiltersAndSort();
    this.calculateStatistics();
  }

  // Apply all filters and sorting
  applyFiltersAndSort(): void {
    // Start with all users
    let filtered = [...this.users];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }

    // Apply department filter
    if (this.selectedDepartment !== 'all') {
      filtered = filtered.filter(user => user.department === this.selectedDepartment);
    }

    // Apply status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === this.selectedStatus);
    }

    // Apply sorting
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
    this.currentPage = 1; // Reset to first page when filters change
    this.updatePagination();
  }

  // Update pagination
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.displayedUsers.slice(startIndex, endIndex);
  }

  // Pagination controls
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

  // Sorting
  sortBy(field: keyof User): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  getSortIcon(field: keyof User): string {
    if (this.sortField !== field) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  // Calculate statistics
  calculateStatistics(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(u => u.status === 'active').length;
    this.inactiveUsers = this.users.filter(u => u.status === 'inactive').length;
  }

  // CRUD operations
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
      status: formValue.status as User['status'],
      joinDate: this.currentUser.joinDate,
      department: formValue.department
    };

    if (this.isEditing) {
      const index = this.users.findIndex(u => u.id === userToSave.id);
      if (index !== -1) {
        this.users[index] = userToSave;
      }
    } else {
      const newId = Math.max(...this.users.map(u => u.id), 0) + 1;
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
      this.users = this.users.filter(u => u.id !== userId);
      this.applyFiltersAndSort();
      this.calculateStatistics();
    }
  }

  toggleUserStatus(user: User): void {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    this.applyFiltersAndSort();
    this.calculateStatistics();
  }

  // Helper methods
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

  isFieldInvalid(fieldName: keyof UserForm['controls']): boolean {
    const control = this.userForm.controls[fieldName];

    return control.invalid && (control.touched || this.formSubmitted);
  }

  hasFieldError(fieldName: keyof UserForm['controls'], errorName: string): boolean {
    const control = this.userForm.controls[fieldName];

    return control.hasError(errorName) && (control.touched || this.formSubmitted);
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedRole = 'all';
    this.selectedDepartment = 'all';
    this.selectedStatus = 'all';
    this.applyFiltersAndSort();
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
