// import { api } from "./api";
// import type { Calculation } from "../types/calculation";

// export const calculationsService = {
//     getAll: () =>
//         api.get<Calculation[]>("/calculations").then((res) => res.data),
//     getById: (id: number) =>
//         api.get<Calculation>(`/calculations/${id}`).then((res) => res.data),
//     create: (data: Partial<Calculation>) =>
//         api.post<Calculation>("/calculations", data).then((res) => res.data),
//     update: (id: number, data: Partial<Calculation>) =>
//         api
//             .patch<Calculation>(`/calculations/${id}`, data)
//             .then((res) => res.data),
//     delete: (id: number) =>
//         api.delete(`/calculations/${id}`).then((res) => res.data),
// };
