import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { User, UserSortField } from '../../../models/user.model';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTableComponent {
  @Input({ required: true }) users!: User[];
  @Input({ required: true }) sortField!: UserSortField;
  @Input({ required: true }) sortDirection!: 'asc' | 'desc';

  @Output() sort = new EventEmitter<UserSortField>();
  @Output() toggleStatus = new EventEmitter<User>();
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<number>();

  getSortIcon(field: UserSortField): string {
    if (this.sortField !== field) {
      return '↕️';
    }

    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  trackByUserId(_index: number, user: User): number {
    return user.id;
  }
}

