import type { User } from "./user";

export interface Calculation {
    id: number;
    userId: number;
    user: User;
    totalCharges: number;
    userShare: number;
    advanceCharges: number;
    balance: number;
    createdAt: string;
    updatedAt: string;
}
