// import { api } from "./api";
// import type { User, CreateUserData, UpdateUserData } from "../types/user";

// export const usersService = {
//     getAll: () => api.get<User[]>("/users").then((res) => res.data),
//     getById: (id: string) =>
//         api.get<User>(`/users/${id}`).then((res) => res.data),
//     create: (data: CreateUserData) =>
//         api
//             .post<User>("/users", {
//                 ...data,
//                 password:
//                     Math.random().toString(36).substring(2, 15) +
//                     Math.random().toString(36).substring(2, 15), // Générer un mot de passe temporaire
//             })
//             .then((res) => res.data),
//     update: (id: string, data: UpdateUserData) =>
//         api.patch<User>(`/users/${id}`, data).then((res) => res.data),
//     delete: (id: string) => api.delete(`/users/${id}`).then((res) => res.data),
// };
