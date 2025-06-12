export type UserRole = "ADMIN" | "basic";

export interface User {
    id: string;
    email: string;
    role: UserRole;
    coproprieteId: string;
    createdAt: string;
    updatedAt: string;
    name?: string;
    tantieme?: number;
    advanceCharges?: number;
    waterMeterOld?: number;
    waterMeterNew?: number;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    role: UserRole;
    coproprieteId: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}
