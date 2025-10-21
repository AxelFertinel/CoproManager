// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "../../components/ui/Button";
// import { Input } from "../../components/ui/Input";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardFooter,
// } from "../../components/ui/Card";
// import type { User } from "../../types/user";

// const userSchema = z.object({
//     name: z.string().min(1, "Le nom est requis"),
//     email: z.string().email("Email invalide"),
//     tantieme: z.number().min(0, "Le tantième doit être positif"),
//     advanceCharges: z
//         .number()
//         .min(0, "L'avance sur charges doit être positive"),
//     waterMeterOld: z.number().min(0, "L'ancien compteur doit être positif"),
//     waterMeterNew: z.number().min(0, "Le nouveau compteur doit être positif"),
// });

// type UserFormData = z.infer<typeof userSchema>;

// interface UserFormProps {
//     user?: User;
//     onSubmit: (data: UserFormData) => void;
//     onCancel: () => void;
// }

// export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//     } = useForm<UserFormData>({
//         resolver: zodResolver(userSchema),
//         defaultValues: user
//             ? {
//                   name: user.name,
//                   email: user.email,
//                   tantieme: user.tantieme,
//                   advanceCharges: user.advanceCharges,
//                   waterMeterOld: user.waterMeterOld,
//                   waterMeterNew: user.waterMeterNew,
//               }
//             : undefined,
//     });

//     return (
//         <Card className="max-w-2xl mx-auto">
//             <CardHeader>
//                 <h2 className="text-2xl font-bold tracking-tight">
//                     {user
//                         ? "Modifier le copropriétaire"
//                         : "Ajouter un copropriétaire"}
//                 </h2>
//                 <p className="text-muted-foreground">
//                     {user
//                         ? "Modifiez les informations du copropriétaire"
//                         : "Remplissez les informations du nouveau copropriétaire"}
//                 </p>
//             </CardHeader>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <CardContent className="space-y-4">
//                     <div className="grid gap-4 md:grid-cols-2">
//                         <div className="space-y-2">
//                             <Input
//                                 {...register("name")}
//                                 error={errors.name?.message}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Input
//                                 type="email"
//                                 {...register("email")}
//                                 error={errors.email?.message}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Input
//                                 type="number"
//                                 step="0.01"
//                                 {...register("tantieme", {
//                                     valueAsNumber: true,
//                                 })}
//                                 error={errors.tantieme?.message}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Input
//                                 type="number"
//                                 step="0.01"
//                                 {...register("advanceCharges", {
//                                     valueAsNumber: true,
//                                 })}
//                                 error={errors.advanceCharges?.message}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Input
//                                 type="number"
//                                 step="0.01"
//                                 {...register("waterMeterOld", {
//                                     valueAsNumber: true,
//                                 })}
//                                 error={errors.waterMeterOld?.message}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Input
//                                 type="number"
//                                 step="0.01"
//                                 {...register("waterMeterNew", {
//                                     valueAsNumber: true,
//                                 })}
//                                 error={errors.waterMeterNew?.message}
//                             />
//                         </div>
//                     </div>
//                 </CardContent>
//                 <CardFooter className="flex justify-end gap-2">
//                     <Button
//                         type="button"
//                         variant="outline"
//                         onClick={onCancel}
//                         disabled={isSubmitting}
//                     >
//                         Annuler
//                     </Button>
//                     <Button type="submit" disabled={isSubmitting}>
//                         {isSubmitting ? (
//                             <div className="flex items-center gap-2">
//                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                 <span>Enregistrement...</span>
//                             </div>
//                         ) : user ? (
//                             "Modifier"
//                         ) : (
//                             "Ajouter"
//                         )}
//                     </Button>
//                 </CardFooter>
//             </form>
//         </Card>
//     );
// }
