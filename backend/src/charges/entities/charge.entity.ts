import { User } from '../../users/entities/user.entity';
import { ChargeType } from '../dto/create-charge.dto';

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
