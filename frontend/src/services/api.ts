import axios from "axios";
import { authService } from "./auth.service";
import {
    Logement,
    CreateLogementData,
    UpdateLogementData,
} from "../types/logement";

const API_URL = "http://localhost:3000";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
    OTHER = "OTHER",
}

export interface Charge {
    id: number;
    type: ChargeType;
    amount: number;
    date: string;
    startDate: string;
    endDate: string;
    waterUnitPrice?: number;
    waterMeterOld?: number;
    waterMeterNew?: number;
    description?: string;
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

// Logements
export const getLogements = async (): Promise<Logement[]> => {
    const response = await api.get(`/logements`);
    return response.data;
};

export const getLogement = async (id: number): Promise<Logement> => {
    const response = await api.get(`/logements/${id}`);
    return response.data;
};

export const createLogement = async (
    data: CreateLogementData
): Promise<Logement> => {
    const response = await api.post(`/logements`, data);
    return response.data;
};

export const updateLogement = async (
    id: number,
    data: UpdateLogementData
): Promise<Logement> => {
    const response = await api.patch(`/logements/${id}`, data);
    return response.data;
};

export const deleteLogement = async (id: number): Promise<void> => {
    await api.delete(`/logements/${id}`);
};

// Auth
export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
    });
    return response.data;
};

export const register = async (data: {
    email: string;
    password: string;
    name: string;
    coproprieteId: string;
}) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
};

// Copropriétés
export const getCoproprietes = async () => {
    const response = await axios.get(`${API_URL}/coproprietes`);
    return response.data;
};

export const getCopropriete = async (id: string) => {
    const response = await axios.get(`${API_URL}/coproprietes/${id}`);
    return response.data;
};

export const createCopropriete = async (data: {
    name: string;
    address: string;
}) => {
    const response = await axios.post(`${API_URL}/coproprietes`, data);
    return response.data;
};

export const updateCopropriete = async (
    id: string,
    data: { name: string; address: string }
) => {
    const response = await axios.patch(`${API_URL}/coproprietes/${id}`, data);
    return response.data;
};

export const deleteCopropriete = async (id: string) => {
    await axios.delete(`${API_URL}/coproprietes/${id}`);
};

// Calculs
export const getCalculations = async () => {
    const response = await axios.get(`${API_URL}/calculations`);
    return response.data;
};

export const getCalculation = async (id: string) => {
    const response = await axios.get(`${API_URL}/calculations/${id}`);
    return response.data;
};

export const createCalculation = async (data: {
    totalWaterBill: number;
    waterUnitPrice: number;
    logementId: number;
}) => {
    const response = await axios.post(`${API_URL}/calculations`, data);
    return response.data;
};

export const updateCalculation = async (
    id: string,
    data: {
        totalWaterBill: number;
        waterUnitPrice: number;
        logementId: number;
    }
) => {
    const response = await axios.patch(`${API_URL}/calculations/${id}`, data);
    return response.data;
};

export const deleteCalculation = async (id: string) => {
    await axios.delete(`${API_URL}/calculations/${id}`);
};
