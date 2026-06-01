import { FormControl, FormGroup } from '@angular/forms';

export type UserStatus = 'active' | 'inactive';
export type StatusFilter = UserStatus | 'all';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  joinDate: Date;
  department: string;
}

export type UserDraft = Omit<User, 'status'> & {
  status: UserStatus | '';
};

export type UserSortField = keyof User;

export interface UserFilters {
  searchTerm: string;
  selectedRole: string;
  selectedDepartment: string;
  selectedStatus: StatusFilter;
}

export type UserForm = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<string>;
  department: FormControl<string>;
  status: FormControl<UserStatus | ''>;
}>;
