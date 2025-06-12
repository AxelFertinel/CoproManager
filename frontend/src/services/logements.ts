import { api } from "./api";
import type {
    Logement,
    CreateLogementData,
    UpdateLogementData,
} from "../types/logement";

export const logementsService = {
    getAll: () => api.get<Logement[]>("/logements").then((res) => res.data),
    getById: (id: number) =>
        api.get<Logement>(`/logements/${id}`).then((res) => res.data),
    create: (data: CreateLogementData) =>
        api.post<Logement>("/logements", data).then((res) => res.data),
    update: (id: number, data: UpdateLogementData) =>
        api.patch<Logement>(`/logements/${id}`, data).then((res) => res.data),
    delete: (id: number) =>
        api.delete(`/logements/${id}`).then((res) => res.data),
};
