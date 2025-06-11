import { Charge } from '../../charges/entities/charge.entity';
import { Calculation } from '../../calculations/entities/calculation.entity';

export class User {
  id: number;
  email: string;
  name: string;
  tantieme: number;
  advanceCharges: number;
  waterMeterOld: number;
  waterMeterNew: number;
  createdAt: Date;
  updatedAt: Date;
  charges?: Charge[];
  calculations?: Calculation[];
}
