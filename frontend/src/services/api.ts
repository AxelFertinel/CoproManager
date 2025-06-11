import axios from "axios";
import { authService } from "./auth.service";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface User {
    id: string;
    email: string;
    name: string;
    tantieme: number;
    advanceCharges: number;
    waterMeterOld: number;
    waterMeterNew: number;
    createdAt: string;
    updatedAt: string;
}

export enum ChargeType {
    WATER = "WATER",
    INSURANCE = "INSURANCE",
    BANK = "BANK",
}

export interface Charge {
    id: string;
    amount: number;
    date: string;
    startDate: string;
    endDate: string;
    type: ChargeType;
    description?: string;
    monthlyCharge?: number;
    waterUnitPrice?: number;
    createdAt: string;
    updatedAt: string;
}

export const createUser = async (
    data: Omit<User, "id" | "createdAt" | "updatedAt">
) => {
    const response = await api.post<User>("/users", data);
    return response.data;
};

export const getUsers = async () => {
    const response = await api.get<User[]>("/users");
    return response.data;
};

export const getUser = async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
};

export const updateUser = async (id: string, data: Partial<User>) => {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: string) => {
    await api.delete(`/users/${id}`);
};

export const createCharge = async (
    data: Omit<Charge, "id" | "createdAt" | "updatedAt" | "monthlyCharge">
) => {
    const response = await api.post<Charge>("/charges", data);
    return response.data;
};

export const getCharges = async () => {
    const response = await api.get<Charge[]>("/charges");
    return response.data;
};

export const getCharge = async (id: string) => {
    const response = await api.get<Charge>(`/charges/${id}`);
    return response.data;
};

export const updateCharge = async (
    id: string,
    data: Partial<Omit<Charge, "monthlyCharge">>
) => {
    const response = await api.patch<Charge>(`/charges/${id}`, data);
    return response.data;
};

export const deleteCharge = async (id: string) => {
    await api.delete(`/charges/${id}`);
};
