import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  templateUrl: './user-stats.component.html',
  styleUrl: './user-stats.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStatsComponent {
  @Input({ required: true }) totalUsers!: number;
  @Input({ required: true }) activeUsers!: number;
  @Input({ required: true }) inactiveUsers!: number;
}

