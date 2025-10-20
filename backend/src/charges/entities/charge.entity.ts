import { User } from '../../users/entities/user.entity';
import { ChargeType } from '../enums/charge-type.enum';

export class Charge {
  id: number;
  type: ChargeType;
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: User;
}
