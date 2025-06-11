import { UserRole } from "./auth";

export interface User {
    id: string;
    email: string;
    name: string;
    tantieme: number;
    advanceCharges: number;
    waterMeterOld: number;
    waterMeterNew: number;
    password: string;
    role: UserRole;
    coproprieteId: string;
    createdAt: string;
    updatedAt: string;
}

// Type pour la création d'un nouvel utilisateur via le formulaire admin
export interface CreateUserData {
    email: string;
    name: string;
    tantieme: number;
    advanceCharges: number;
    waterMeterOld: number;
    waterMeterNew: number;
    role: UserRole;
    coproprieteId: string;
    // Le mot de passe et coproprieteId seront gérés par le backend/frontend automatiquement
}

// Type pour la mise à jour d'un utilisateur
export interface UpdateUserData {
    email?: string;
    name?: string;
    tantieme?: number;
    advanceCharges?: number;
    waterMeterOld?: number;
    waterMeterNew?: number;
    password?: string;
    role?: UserRole;
}
