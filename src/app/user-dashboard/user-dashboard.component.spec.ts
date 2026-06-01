import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardComponent } from './user-dashboard.component';

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should block creating a user with invalid fields', () => {
    const initialCount = component.users.length;

    component.openAddForm();
    component.userForm.setValue({
      name: '   ',
      email: 'not-an-email',
      role: '',
      department: '',
      status: ''
    });

    component.saveUser();

    expect(component.users.length).toBe(initialCount);
    expect(component.showForm).toBeTrue();
  });

  it('should create a valid user with trimmed text fields', () => {
    const initialCount = component.users.length;

    component.openAddForm();
    component.userForm.setValue({
      name: '  Ada Lovelace  ',
      email: '  ada.lovelace@example.com  ',
      role: 'Developer',
      department: 'Engineering',
      status: 'active'
    });

    component.saveUser();

    const createdUser = component.users[component.users.length - 1];
    expect(component.users.length).toBe(initialCount + 1);
    expect(createdUser.name).toBe('Ada Lovelace');
    expect(createdUser.email).toBe('ada.lovelace@example.com');
    expect(component.showForm).toBeFalse();
  });

  it('should block updating a user with invalid fields', () => {
    const originalUser = { ...component.users[0] };

    component.openEditForm(component.users[0]);
    component.userForm.patchValue({
      name: '',
      email: ''
    });

    component.saveUser();

    expect(component.users[0]).toEqual(originalUser);
    expect(component.showForm).toBeTrue();
  });

  it('should filter users by active status', () => {
    component.selectedStatus = 'active';

    component.applyFiltersAndSort();

    expect(component.displayedUsers.length).toBe(component.activeUsers);
    expect(component.displayedUsers.every(user => user.status === 'active')).toBeTrue();
  });

  it('should filter users by inactive status and reset status filters', () => {
    component.selectedStatus = 'inactive';
    component.applyFiltersAndSort();

    expect(component.displayedUsers.length).toBe(component.inactiveUsers);
    expect(component.displayedUsers.every(user => user.status === 'inactive')).toBeTrue();

    component.resetFilters();

    expect(component.selectedStatus).toBe('all');
    expect(component.displayedUsers.length).toBe(component.users.length);
  });
});
