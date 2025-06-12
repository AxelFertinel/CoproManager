import { UserRole } from "./auth";

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

// Type pour la création d'un nouveau logement
export interface CreateLogementData {
    name: string;
    email: string;
    tantieme: number;
    advanceCharges: number;
    waterMeterOld: number;
    waterMeterNew: number;
    coproprieteId: string;
}

// Type pour la mise à jour d'un logement
export interface UpdateLogementData {
    name?: string;
    email?: string;
    tantieme?: number;
    advanceCharges?: number;
    waterMeterOld?: number;
    waterMeterNew?: number;
    coproprieteId?: string;
}
