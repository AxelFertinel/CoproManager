import React, { useState } from "react";
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

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Link to="/logement/new">
                    <Button>Ajouter un logement</Button>
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/logement/${logement.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        <Button variant="outline">
                                            Modifier
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
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
