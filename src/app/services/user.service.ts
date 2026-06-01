import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MOCK_USERS } from '../data/mock-users';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUsers(): Observable<User[]> {
    return of(MOCK_USERS.map(user => ({ ...user, joinDate: new Date(user.joinDate) })));
  }
}
