// import React, { useEffect, useState } from "react";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardDescription,
//     CardTitle,
//     CardFooter,
// } from "../../components/ui/Card";
// import { Button } from "../../components/ui/Button";
// import { getLogements, deleteLogement } from "../../services/api";
// import { Logement } from "../../types/user";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";

// export default function LogementList() {
//     const [logements, setLogements] = useState<Logement[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         loadLogements();
//     }, []);

//     const loadLogements = async () => {
//         try {
//             setLoading(true);
//             const data = await getLogements();
//             setLogements(data);
//             setError(null);
//         } catch (err) {
//             console.error(err);
//             toast.error("Erreur lors du chargement des logements");
//             setError("Erreur lors du chargement des logements");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id: number) => {
//         if (
//             window.confirm("Êtes-vous sûr de vouloir supprimer ce logement ?")
//         ) {
//             try {
//                 await deleteLogement(id);
//                 setLogements(
//                     logements.filter((logement) => logement.id !== id)
//                 );
//                 toast.success("Logement supprimé avec succès");
//             } catch (err) {
//                 console.error(err);
//                 toast.error("Erreur lors de la suppression du logement");
//                 setError("Erreur lors de la suppression du logement");
//             }
//         }
//     };

//     if (loading) {
//         return (
//             <div className="text-center py-10">Chargement des logements...</div>
//         );
//     }

//     if (error) {
//         return <div className="text-red-500 text-center py-10">{error}</div>;
//     }

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-3xl font-bold tracking-tight">
//                         Logements
//                     </h1>
//                     <p className="text-muted-foreground">
//                         Gérez les logements de votre immeuble
//                     </p>
//                 </div>
//                 <Link to="/logement/new">
//                     <Button>Ajouter un logement</Button>
//                 </Link>
//             </div>

//             <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
//                 {logements.length > 0 ? (
//                     logements.map((logement) => (
//                         <Card
//                             key={logement.id}
//                             className="h-full flex flex-col justify-between"
//                         >
//                             <CardHeader>
//                                 <CardTitle>{logement.name}</CardTitle>
//                                 <CardDescription>
//                                     {logement.email}
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent className="flex-grow">
//                                 <dl className="grid grid-cols-2 gap-4 text-sm">
//                                     <div>
//                                         <dt className="text-muted-foreground">
//                                             Tantième
//                                         </dt>
//                                         <dd>{logement.tantieme}</dd>
//                                     </div>
//                                     <div>
//                                         <dt className="text-muted-foreground">
//                                             Avance
//                                         </dt>
//                                         <dd>{logement.advanceCharges}€</dd>
//                                     </div>
//                                     <div>
//                                         <dt className="text-muted-foreground">
//                                             Compteur d'eau
//                                         </dt>
//                                         <dd>
//                                             {logement.waterMeterOld} →{" "}
//                                             {logement.waterMeterNew}
//                                         </dd>
//                                     </div>
//                                     <div>
//                                         <dt className="text-muted-foreground">
//                                             Dernière mise à jour
//                                         </dt>
//                                         <dd>
//                                             {new Date(
//                                                 logement.updatedAt
//                                             ).toLocaleDateString("fr-FR")}
//                                         </dd>
//                                     </div>
//                                 </dl>
//                             </CardContent>
//                             <CardFooter className="flex justify-end space-x-2">
//                                 <Link to={`/logement/${logement.id}/edit`}>
//                                     <Button variant="outline">Modifier</Button>
//                                 </Link>
//                                 <Button
//                                     variant="destructive"
//                                     onClick={() => handleDelete(logement.id)}
//                                 >
//                                     Supprimer
//                                 </Button>
//                             </CardFooter>
//                         </Card>
//                     ))
//                 ) : (
//                     <p>Aucun logement trouvé.</p>
//                 )}
//             </div>
//         </div>
//     );
// }
