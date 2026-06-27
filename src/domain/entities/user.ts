export interface User {
  id: number;
  roleId: number;
  role?: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
