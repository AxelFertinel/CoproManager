import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";
import { Logement } from "../../types/logement";
import { logementsService } from "../../services/logements";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../components/ui/AlertDialog";

interface LogementListProps {
    logements: Logement[];
}

export default function LogementList({ logements }: LogementListProps) {
    const [logementToDelete, setLogementToDelete] = useState<Logement | null>(
        null
    );
    const queryClient = useQueryClient();

    const deleteLogementMutation = useMutation({
        mutationFn: (id: number) => logementsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logements"] });
            toast.success("Logement supprimé avec succès");
            setLogementToDelete(null);
        },
        onError: (error) => {
            toast.error("Erreur lors de la suppression du logement");
            console.error(error);
        },
    });

    const handleDelete = (logement: Logement) => {
        setLogementToDelete(logement);
    };

    const confirmDelete = () => {
        if (logementToDelete) {
            deleteLogementMutation.mutate(logementToDelete.id);
        }
    };

    if (logements.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">
                    Aucun logement n'a encore été ajouté. Ajoutez un nouveau
                    logment pour commencer.
                </p>
                <Link to="/logement/new">
                    <Button className="mt-4">Ajouter un logement</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Vue mobile */}
            <div className="lg:hidden space-y-4">
                {logements.map((logement) => (
                    <div
                        key={logement.id}
                        className="bg-white p-4 rounded-lg shadow"
                    >
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <h3 className="font-medium text-gray-900">
                                    {logement.name}
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {logement.email}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>Tantième: {logement.tantieme}</p>
                                <p>
                                    Avance sur charges :{" "}
                                    {logement.advanceCharges} €
                                </p>
                                <p>
                                    Compteur d'eau : {logement.waterMeterOld}→{" "}
                                    {logement.waterMeterNew}{" "}
                                </p>
                                <p>
                                    Dernière mise à jour :{" "}
                                    {new Date(
                                        logement.updatedAt
                                    ).toLocaleDateString("fr-FR")}
                                </p>
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <Link to={`/logement/${logement.id}`}>
                                    <Button
                                        variant="outline"
                                        className="h-8 px-3 text-xs"
                                    >
                                        Modifier
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    className="h-8 px-3 text-xs"
                                    onClick={() => handleDelete(logement)}
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Vue desktop */}
            <div className="hidden lg:block bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nom
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tantième
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Avance sur charges
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Compteur d'eau m³
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dernière mise à jour
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logements.map((logement) => (
                            <tr key={logement.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {logement.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {logement.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {logement.tantieme}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {logement.advanceCharges} €
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {logement.waterMeterOld} →{" "}
                                    {logement.waterMeterNew}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(
                                        logement.updatedAt
                                    ).toLocaleDateString("fr-FR")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/logement/${logement.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        <Button
                                            variant="outline"
                                            className="h-8 px-3 text-xs"
                                        >
                                            Modifier
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        className="h-8 px-3 text-xs"
                                        onClick={() => handleDelete(logement)}
                                    >
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AlertDialog
                open={!!logementToDelete}
                onOpenChange={() => setLogementToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le logement{" "}
                            {logementToDelete?.name} sera définitivement
                            supprimé.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
