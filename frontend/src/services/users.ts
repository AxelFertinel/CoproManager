import { api } from "./api";
import type { User } from "../types/user";

export const usersService = {
    getAll: () => api.get<User[]>("/users").then((res) => res.data),
    getById: (id: number) =>
        api.get<User>(`/users/${id}`).then((res) => res.data),
    create: (data: Partial<User>) =>
        api.post<User>("/users", data).then((res) => res.data),
    update: (id: number, data: Partial<User>) =>
        api.patch<User>(`/users/${id}`, data).then((res) => res.data),
    delete: (id: number) => api.delete(`/users/${id}`).then((res) => res.data),
};
