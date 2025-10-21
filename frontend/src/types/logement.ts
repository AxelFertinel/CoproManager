export interface Logement {
    id: number;
    name: string;
    email: string;
    tantieme: number;
    advanceCharges: number;
    waterMeterOld: number;
    waterMeterNew: number;
    coproprieteId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateLogementData {
    name: string;
    email: string;
    tantieme: number;
    advanceCharges: number;
    waterMeterOld: number;
    waterMeterNew: number;
    coproprieteId: string;
}

export interface UpdateLogementData {
    name?: string;
    email?: string;
    tantieme?: number;
    advanceCharges?: number;
    waterMeterOld?: number;
    waterMeterNew?: number;
    coproprieteId?: string;
}
