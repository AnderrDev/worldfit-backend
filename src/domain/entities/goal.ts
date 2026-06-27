export interface Goal {
  id: number;
  userId: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
