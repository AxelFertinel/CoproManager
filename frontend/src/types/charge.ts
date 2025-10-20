export type ChargeType = "WATER" | "INSURANCE" | "BANK" | "OTHER";

export interface Charge {
    id: number;
    type: ChargeType;
    amount: number;
    date: string;
    startDate?: string;
    endDate?: string;
    waterUnitPrice?: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
    waterMeterOld?: number;
    waterMeterNew?: number;
}
