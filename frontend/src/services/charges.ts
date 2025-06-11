import { api, Charge } from "./api";

export const chargesService = {
    getAll: () => api.get<Charge[]>("/charges").then((res) => res.data),
    getById: (id: number) =>
        api.get<Charge>(`/charges/${id}`).then((res) => res.data),
    create: (data: Partial<Charge>) =>
        api.post<Charge>("/charges", data).then((res) => res.data),
    update: (id: number, data: Partial<Charge>) =>
        api.patch<Charge>(`/charges/${id}`, data).then((res) => res.data),
    delete: (id: number) =>
        api.delete(`/charges/${id}`).then((res) => res.data),
};
