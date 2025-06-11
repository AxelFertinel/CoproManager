export type ChargeType = "WATER" | "INSURANCE" | "BANK";

export interface Charge {
    id: number;
    type: ChargeType;
    amount: number;
    date: string;
    createdAt: string;
    updatedAt: string;
}
