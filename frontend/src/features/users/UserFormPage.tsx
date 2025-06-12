// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useNavigate, useParams } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { useEffect, useState } from "react";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "../../components/ui/Card";
// import {
//     createLogement,
//     updateLogement,
//     getLogement,
// } from "../../services/api";
// import {
//     CreateLogementData,
//     UpdateLogementData,
//     Logement,
// } from "../../types/user";
// import { Button } from "../../components/ui/Button";
// import { authService } from "../../services/auth.service";

// // Schema for form data, matches CreateLogementData fields
// const logementFormSchema = z.object({
//     name: z.string().min(1, "Le nom est requis"),
//     email: z.string().email("Email invalide"),
//     tantieme: z.number().min(0, "Le tantième doit être positif"),
//     advanceCharges: z.number().min(0, "L'avance doit être positive"),
//     waterMeterOld: z.number().min(0, "Le compteur d'eau doit être positif"),
//     waterMeterNew: z.number().min(0, "Le compteur d'eau doit être positif"),
// });

// type LogementFormData = z.infer<typeof logementFormSchema>;

// const defaultLogementFormData: LogementFormData = {
//     name: "",
//     email: "",
//     tantieme: 0,
//     advanceCharges: 0,
//     waterMeterOld: 0,
//     waterMeterNew: 0,
// };

// export default function LogementFormPage() {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();

//     const { data: logement, isLoading: isLogementLoading } = useQuery<
//         Logement,
//         Error
//     >({
//         queryKey: ["logements", id],
//         queryFn: () => getLogement(Number(id)),
//         enabled: !!id,
//     });

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset,
//     } = useForm<LogementFormData>({
//         resolver: zodResolver(logementFormSchema),
//         defaultValues: defaultLogementFormData,
//     });

//     useEffect(() => {
//         if (logement) {
//             reset({
//                 name: logement.name,
//                 email: logement.email,
//                 tantieme: logement.tantieme,
//                 advanceCharges: logement.advanceCharges,
//                 waterMeterOld: logement.waterMeterOld,
//                 waterMeterNew: logement.waterMeterNew,
//             });
//         }
//     }, [logement, reset]);

//     // Mutation for creating a logement
//     const createLogementMutation = useMutation<
//         Logement,
//         Error,
//         CreateLogementData
//     >({
//         mutationFn: createLogement,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["logements"] });
//             toast.success("Logement créé avec succès");
//             navigate("/logement");
//         },
//         onError: (error) => {
//             toast.error("Erreur lors de la création du logement");
//             console.error(error);
//         },
//     });

//     // Mutation for updating a logement
//     const updateLogementMutation = useMutation<
//         Logement,
//         Error,
//         { id: number; data: UpdateLogementData }
//     >({
//         mutationFn: ({ id, data }) => updateLogement(id, data),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["logements"] });
//             toast.success("Logement mis à jour avec succès");
//             navigate("/logement");
//         },
//         onError: (error) => {
//             toast.error("Erreur lors de la mise à jour du logement");
//             console.error(error);
//         },
//     });

//     const onSubmit = (data: LogementFormData) => {
//         const currentUser = authService.getCurrentUser();
//         if (!currentUser) {
//             toast.error("Erreur: Utilisateur non connecté.");
//             return;
//         }

//         if (id) {
//             updateLogementMutation.mutate({
//                 id: Number(id),
//                 data: {
//                     ...(data as UpdateLogementData),
//                     coproprieteId: currentUser.coproprieteId,
//                 },
//             });
//         } else {
//             createLogementMutation.mutate({
//                 ...(data as CreateLogementData),
//                 coproprieteId: currentUser.coproprieteId,
//             });
//         }
//     };

//     if (isLogementLoading) {
//         return (
//             <div className="text-center py-10">Chargement du logement...</div>
//         );
//     }

//     return (
//         <div>
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
//                 <h1 className="text-2xl font-bold">
//                     {id ? "Modifier le Logement" : "Ajouter un Logement"}
//                 </h1>
//             </div>
//             <Card>
//                 <CardHeader>
//                     <CardTitle>
//                         {id ? "Modifier Logement" : "Ajouter un logement"}
//                     </CardTitle>
//                     <CardDescription>
//                         {id
//                             ? "Modifiez les informations du logement"
//                             : "Ajoutez un nouveau logement à la copropriété"}
//                     </CardDescription>
//                 </CardHeader>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <CardContent className="space-y-4">
//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="name"
//                                 className="text-sm font-medium"
//                             >
//                                 Nom
//                             </label>
//                             <input
//                                 {...register("name")}
//                                 type="text"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                                 placeholder="Nom du logement"
//                             />
//                             {errors.name && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.name.message}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="email"
//                                 className="text-sm font-medium"
//                             >
//                                 Email
//                             </label>
//                             <input
//                                 {...register("email")}
//                                 type="email"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                                 placeholder="email@example.com"
//                             />
//                             {errors.email && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.email.message}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="tantieme"
//                                 className="text-sm font-medium"
//                             >
//                                 Tantième
//                             </label>
//                             <input
//                                 {...register("tantieme", {
//                                     valueAsNumber: true,
//                                 })}
//                                 type="number"
//                                 step="any"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                                 placeholder="Tantième"
//                             />
//                             {errors.tantieme && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.tantieme.message}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="advanceCharges"
//                                 className="text-sm font-medium"
//                             >
//                                 Avance de Charges
//                             </label>
//                             <input
//                                 {...register("advanceCharges", {
//                                     valueAsNumber: true,
//                                 })}
//                                 type="number"
//                                 step="any"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                                 placeholder="Avance de charges"
//                             />
//                             {errors.advanceCharges && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.advanceCharges.message}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="waterMeterOld"
//                                 className="text-sm font-medium"
//                             >
//                                 Ancien Index Compteur d'Eau
//                             </label>
//                             <input
//                                 {...register("waterMeterOld", {
//                                     valueAsNumber: true,
//                                 })}
//                                 type="number"
//                                 step="any"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                                 placeholder="Ancien index"
//                             />
//                             {errors.waterMeterOld && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.waterMeterOld.message}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="waterMeterNew"
//                                 className="text-sm font-medium"
//                             >
//                                 Nouvel Index Compteur d'Eau
//                             </label>
//                             <input
//                                 {...register("waterMeterNew", {
//                                     valueAsNumber: true,
//                                 })}
//                                 type="number"
//                                 step="any"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                                 placeholder="Nouvel index"
//                             />
//                             {errors.waterMeterNew && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.waterMeterNew.message}
//                                 </p>
//                             )}
//                         </div>
//                     </CardContent>
//                     <CardFooter className="flex justify-end">
//                         <Button type="submit">
//                             {id ? "Mettre à jour" : "Créer"}
//                         </Button>
//                     </CardFooter>
//                 </form>
//             </Card>
//         </div>
//     );
// }
