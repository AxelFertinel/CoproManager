export type UserRole = "admin" | "basic";

export interface User {
    id: number;
    email: string;
    role: UserRole;
    coproprieteId: number;
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
    coproprieteId: number;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}
