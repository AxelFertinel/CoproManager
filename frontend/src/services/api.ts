import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

export interface User {
    id: number;
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
    id: number;
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

export const getUser = async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
};

export const updateUser = async (id: number, data: Partial<User>) => {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: number) => {
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

export const getCharge = async (id: number) => {
    const response = await api.get<Charge>(`/charges/${id}`);
    return response.data;
};

export const updateCharge = async (
    id: number,
    data: Partial<Omit<Charge, "monthlyCharge">>
) => {
    const response = await api.patch<Charge>(`/charges/${id}`, data);
    return response.data;
};

export const deleteCharge = async (id: number) => {
    await api.delete(`/charges/${id}`);
};
