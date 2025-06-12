import type { User } from "./user";

export interface Calculation {
    id: number;
    logementId: number;
    waterAmount: number;
    insuranceAmount: number;
    bankAmount: number;
    advanceCharges: number;
    totalAmount: number;
    date: string;
    createdAt: string;
    updatedAt: string;
}
