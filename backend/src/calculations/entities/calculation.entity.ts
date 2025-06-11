import { User } from '../../users/entities/user.entity';

export class Calculation {
  id: number;
  totalAmount: number;
  waterAmount: number;
  insuranceAmount: number;
  bankAmount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: User;
}
