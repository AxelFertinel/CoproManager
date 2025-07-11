import axios from "axios";
import {
    LoginCredentials,
    RegisterData,
    AuthResponse,
    User,
} from "../types/auth";

const API_URL = "http://localhost:3000/auth";

class AuthService {
    private readonly TOKEN_KEY = "token";
    private readonly USER_KEY = "user";

    // Ajout d'un gestionnaire d'événements pour notifier les changements d'état d'authentification
    private authStatusChangeHandlers: (() => void)[] = [];

    onAuthStatusChange(handler: () => void) {
        this.authStatusChangeHandlers.push(handler);
    }

    offAuthStatusChange(handler: () => void) {
        this.authStatusChangeHandlers = this.authStatusChangeHandlers.filter(
            (h) => h !== handler
        );
    }

    private emitAuthStatusChange() {
        this.authStatusChangeHandlers.forEach((handler) => handler());
    }

    login(credentials: LoginCredentials): Promise<AuthResponse> {
        return axios.post(`${API_URL}/login`, credentials).then((response) => {
            if (response.data.access_token) {
                localStorage.setItem(
                    this.TOKEN_KEY,
                    response.data.access_token
                );
                localStorage.setItem(
                    this.USER_KEY,
                    JSON.stringify(response.data.user)
                );
                this.emitAuthStatusChange(); // Émettre l'événement après la connexion
            }
            return response.data;
        });
    }

    register(data: RegisterData): Promise<AuthResponse> {
        return axios.post(`${API_URL}/register`, data).then((response) => {
            if (response.data.access_token) {
                localStorage.setItem(
                    this.TOKEN_KEY,
                    response.data.access_token
                );
                localStorage.setItem(
                    this.USER_KEY,
                    JSON.stringify(response.data.user)
                );
                this.emitAuthStatusChange();
            }
            return response.data;
        });
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.emitAuthStatusChange(); // Émettre l'événement après la déconnexion
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isLoggedIn(): boolean {
        return this.getToken() !== null;
    }

    getAuthHeader(): string {
        return `Bearer ${this.getToken()}`;
    }
}

export const authService = new AuthService();
