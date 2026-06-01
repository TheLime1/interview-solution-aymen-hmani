import { User } from '../models/user.model';

export const MOCK_USERS: User[] = [
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

