// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "../../components/ui/Button";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardFooter,
// } from "../../components/ui/Card";
// import { getLogements, deleteLogement } from "../../services/api";
// import { toast } from "react-toastify";
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "../../components/ui/AlertDialog";
// import { Logement } from "../../types/user";

// export default function UserListPage() {
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();

//     const { data: logements, isLoading } = useQuery<Logement[]>({
//         queryKey: ["logements"],
//         queryFn: getLogements,
//     });

//     const deleteLogementMutation = useMutation({
//         mutationFn: deleteLogement,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["logements"] });
//             toast.success("Logement supprimé avec succès");
//         },
//         onError: (error) => {
//             toast.error("Erreur lors de la suppression du logement");
//             console.error(error);
//         },
//     });

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center min-h-[400px]">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="py-6 space-y-6">
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h1 className="text-3xl font-bold tracking-tight">
//                         Logements
//                     </h1>
//                     <p className="text-muted-foreground">
//                         Gérez les logements de votre copropriété et leurs
//                         informations
//                     </p>
//                 </div>
//                 <Button onClick={() => navigate("/logement/new")}>
//                     Ajouter un logement
//                 </Button>
//             </div>

//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {logements?.map((logement) => (
//                     <Card
//                         key={logement.id}
//                         className="hover:shadow-lg transition-shadow"
//                     >
//                         <CardHeader>
//                             <div className="flex justify-between items-center">
//                                 <div>
//                                     <h2 className="text-xl font-semibold">
//                                         {logement.name}
//                                     </h2>
//                                     <p className="text-sm text-muted-foreground">
//                                         {logement.email}
//                                     </p>
//                                 </div>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid gap-4">
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-sm text-muted-foreground">
//                                         Tantième
//                                     </span>
//                                     <span className="font-medium">
//                                         {logement.tantieme}%
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-sm text-muted-foreground">
//                                         Avance sur charges
//                                     </span>
//                                     <span className="font-medium">
//                                         {logement.advanceCharges}€/mois
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-sm text-muted-foreground">
//                                         Compteur d'eau
//                                     </span>
//                                     <span className="font-medium">
//                                         {logement.waterMeterOld} →{" "}
//                                         {logement.waterMeterNew} m³
//                                     </span>
//                                 </div>
//                             </div>
//                         </CardContent>
//                         <CardFooter className="flex justify-end gap-2">
//                             <Button
//                                 variant="outline"
//                                 onClick={() =>
//                                     navigate(`/logement/${logement.id}/edit`)
//                                 }
//                             >
//                                 Modifier
//                             </Button>
//                             <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                     <Button variant="destructive">
//                                         Supprimer
//                                     </Button>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                     <AlertDialogHeader>
//                                         <AlertDialogTitle>
//                                             Êtes-vous absolument sûr ?
//                                         </AlertDialogTitle>
//                                         <AlertDialogDescription>
//                                             Cette action ne peut pas être
//                                             annulée. Cela supprimera
//                                             définitivement ce logement de nos
//                                             serveurs.
//                                         </AlertDialogDescription>
//                                     </AlertDialogHeader>
//                                     <AlertDialogFooter>
//                                         <AlertDialogCancel>
//                                             Annuler
//                                         </AlertDialogCancel>
//                                         <AlertDialogAction
//                                             onClick={() =>
//                                                 deleteLogementMutation.mutate(
//                                                     logement.id
//                                                 )
//                                             }
//                                         >
//                                             Continuer
//                                         </AlertDialogAction>
//                                     </AlertDialogFooter>
//                                 </AlertDialogContent>
//                             </AlertDialog>
//                         </CardFooter>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     );
// }
