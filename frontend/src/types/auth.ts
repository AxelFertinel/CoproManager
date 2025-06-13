export type UserRole = "ADMIN" | "USER";

export interface User {
    role: UserRole;
    coproprieteId: string;
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

export interface RegisterData {
    email: string;
    password: string;
    coproprieteId: string;
    role: UserRole;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}
