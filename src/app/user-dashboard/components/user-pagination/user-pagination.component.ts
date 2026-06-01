import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-pagination.component.html',
  styleUrl: './user-pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPaginationComponent {
  @Input({ required: true }) currentPage!: number;
  @Input({ required: true }) totalPages!: number;

  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_value, index) => index + 1);
  }
}

