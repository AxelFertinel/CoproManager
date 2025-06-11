import { api, Charge } from "./api";

export const chargesService = {
    getAll: () => api.get<Charge[]>("/charges").then((res) => res.data),
    getById: (id: string) =>
        api.get<Charge>(`/charges/${id}`).then((res) => res.data),
    create: (data: Partial<Charge>) =>
        api.post<Charge>("/charges", data).then((res) => res.data),
    update: (id: string, data: Partial<Charge>) =>
        api.patch<Charge>(`/charges/${id}`, data).then((res) => res.data),
    delete: (id: string) =>
        api.delete(`/charges/${id}`).then((res) => res.data),
};
