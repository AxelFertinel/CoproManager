// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useNavigate, useParams } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "../../components/ui/Card";
// import { calculationsService } from "../../services/calculations";
// import { Button } from "../../components/ui/Button";

// const calculationFormSchema = z.object({
//     date: z.string().min(1, "La date est requise"),
//     waterAmount: z.number().min(0, "Le montant doit être positif"),
//     insuranceAmount: z.number().min(0, "Le montant doit être positif"),
//     bankAmount: z.number().min(0, "Le montant doit être positif"),
//     advanceCharges: z.number().min(0, "Le montant doit être positif"),
//     totalAmount: z.number().min(0, "Le montant doit être positif"),
// });

// type CalculationFormData = z.infer<typeof calculationFormSchema>;

// const defaultCalculationFormData: CalculationFormData = {
//     date: new Date().toISOString().split("T")[0],
//     waterAmount: 0,
//     insuranceAmount: 0,
//     bankAmount: 0,
//     advanceCharges: 0,
//     totalAmount: 0,
// };

// export default function CalculationFormPage() {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();

//     const { data: calculation, isLoading: isCalculationLoading } = useQuery({
//         queryKey: ["calculations", id],
//         queryFn: () => calculationsService.getById(Number(id)),
//         enabled: !!id,
//     });

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset,
//     } = useForm<CalculationFormData>({
//         resolver: zodResolver(calculationFormSchema),
//         defaultValues: calculation
//             ? {
//                   date: new Date(calculation.date).toISOString().split("T")[0],
//                   waterAmount: calculation.waterAmount,
//                   insuranceAmount: calculation.insuranceAmount,
//                   bankAmount: calculation.bankAmount,
//                   advanceCharges: calculation.advanceCharges,
//                   totalAmount: calculation.totalAmount,
//               }
//             : defaultCalculationFormData,
//     });

//     const createCalculationMutation = useMutation({
//         mutationFn: calculationsService.create,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["calculations"] });
//             toast.success("Calcul créé avec succès");
//             navigate("/calculations");
//         },
//         onError: (error) => {
//             toast.error("Erreur lors de la création du calcul");
//             console.error(error);
//         },
//     });

//     const updateCalculationMutation = useMutation({
//         mutationFn: ({ id, data }: { id: number; data: CalculationFormData }) =>
//             calculationsService.update(id, data),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["calculations"] });
//             toast.success("Calcul mis à jour avec succès");
//             navigate("/calculations");
//         },
//         onError: (error) => {
//             toast.error("Erreur lors de la mise à jour du calcul");
//             console.error(error);
//         },
//     });

//     const onSubmit = (data: CalculationFormData) => {
//         if (id) {
//             updateCalculationMutation.mutate({
//                 id: Number(id),
//                 data,
//             });
//         } else {
//             createCalculationMutation.mutate(data);
//         }
//     };

//     if (isCalculationLoading && id) {
//         return <div>Chargement...</div>;
//     }

//     return (
//         <div>
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
//                 <h1 className="text-2xl font-bold">
//                     {id ? "Modifier le calcul" : "Nouveau calcul"}
//                 </h1>
//             </div>
//             <Card>
//                 <CardHeader>
//                     <CardTitle>
//                         {id ? "Modifier le calcul" : "Nouveau calcul"}
//                     </CardTitle>
//                     <CardDescription>
//                         {id
//                             ? "Modifiez les informations du calcul"
//                             : "Créez un nouveau calcul"}
//                     </CardDescription>
//                 </CardHeader>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <CardContent className="space-y-4">
//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="date"
//                                 className="text-sm font-medium"
//                             >
//                                 Date
//                             </label>
//                             <input
//                                 {...register("date")}
//                                 type="date"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                             />
//                             {errors.date && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.date.message}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="waterAmount"
//                                 className="text-sm font-medium"
//                             >
//                                 Montant Eau
//                             </label>
//                             <input
//                                 {...register("waterAmount", {
//                                     valueAsNumber: true,
//                                 })}
//                                 type="number"
//                                 step="0.01"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                             />
//                             {errors.waterAmount && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.waterAmount.message}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="insuranceAmount"
//                                 className="text-sm font-medium"
//                             >
//                                 Montant Assurance
//                             </label>
//                             <input
//                                 {...register("insuranceAmount", {
//                                     valueAsNumber: true,
//                                 })}
//                                 type="number"
//                                 step="0.01"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                             />
//                             {errors.insuranceAmount && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.insuranceAmount.message}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="bankAmount"
//                                 className="text-sm font-medium"
//                             >
//                                 Montant Bancaire
//                             </label>
//                             <input
//                                 {...register("bankAmount", {
//                                     valueAsNumber: true,
//                                 })}
//                                 type="number"
//                                 step="0.01"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                             />
//                             {errors.bankAmount && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.bankAmount.message}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="advanceCharges"
//                                 className="text-sm font-medium"
//                             >
//                                 Avance Charges
//                             </label>
//                             <input
//                                 {...register("advanceCharges", {
//                                     valueAsNumber: true,
//                                 })}
//                                 type="number"
//                                 step="0.01"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                             />
//                             {errors.advanceCharges && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.advanceCharges.message}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <label
//                                 htmlFor="totalAmount"
//                                 className="text-sm font-medium"
//                             >
//                                 Montant Total
//                             </label>
//                             <input
//                                 {...register("totalAmount", {
//                                     valueAsNumber: true,
//                                 })}
//                                 type="number"
//                                 step="0.01"
//                                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                             />
//                             {errors.totalAmount && (
//                                 <p className="text-sm text-destructive">
//                                     {errors.totalAmount.message}
//                                 </p>
//                             )}
//                         </div>
//                     </CardContent>
//                     <CardFooter className="flex justify-end">
//                         <Button
//                             type="submit"
//                             disabled={
//                                 createCalculationMutation.isPending ||
//                                 updateCalculationMutation.isPending
//                             }
//                         >
//                             {createCalculationMutation.isPending ||
//                             updateCalculationMutation.isPending
//                                 ? "Enregistrement..."
//                                 : id
//                                 ? "Mettre à jour"
//                                 : "Créer"}
//                         </Button>
//                     </CardFooter>
//                 </form>
//             </Card>
//         </div>
//     );
// }
