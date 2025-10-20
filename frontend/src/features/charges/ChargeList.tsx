import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";
import { Charge } from "../../types/charge";
import { chargesService } from "../../services/charges";
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

interface ChargeListProps {
    charges: Charge[];
}

export default function ChargeList({ charges }: ChargeListProps) {
    const [chargeToDelete, setChargeToDelete] = useState<Charge | null>(null);
    const queryClient = useQueryClient();

    const deleteChargeMutation = useMutation({
        mutationFn: (id: string) => chargesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["charges"] });
            toast.success("Charge supprimée avec succès");
            setChargeToDelete(null);
        },
        onError: (error) => {
            toast.error("Erreur lors de la suppression de la charge");
            console.error(error);
        },
    });

    const handleDelete = (charge: Charge) => {
        setChargeToDelete(charge);
    };

    const confirmDelete = () => {
        if (chargeToDelete) {
            deleteChargeMutation.mutate(chargeToDelete.id.toString());
        }
    };

    const getChargeTypeLabel = (type: string) => {
        switch (type) {
            case "WATER":
                return "Facture d'eau";
            case "INSURANCE":
                return "Assurance";
            case "BANK":
                return "Frais bancaires";
            case "OTHER":
                return "Autre";
        }
    };

    if (charges.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">
                    Aucune charge trouvée. Ajoutez une nouvelle charge pour
                    commencer.
                </p>
                <Link to="/charges/new">
                    <Button className="mt-4">Ajouter une charge</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Vue mobile */}
            <div className="lg:hidden space-y-4">
                {charges.map((charge) => (
                    <div
                        key={charge.id}
                        className="bg-white p-4 rounded-lg shadow"
                    >
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <h3 className="font-medium text-gray-900">
                                    {getChargeTypeLabel(charge.type)}
                                </h3>
                                <span className="text-lg font-semibold">
                                    {charge.amount.toFixed(2)} €
                                </span>
                            </div>
                            {charge.waterUnitPrice && (
                                <p className="text-sm text-gray-500">
                                    Prix unitaire: {charge.waterUnitPrice} €/m³
                                </p>
                            )}
                            <div className="text-sm text-gray-500">
                                <p>
                                    Date:{" "}
                                    {new Date(charge.date).toLocaleDateString(
                                        "fr-FR"
                                    )}
                                </p>
                                {charge.type !== "OTHER" &&
                                    charge.startDate &&
                                    charge.endDate && (
                                        <p>
                                            Période:{" "}
                                            {new Date(
                                                charge.startDate
                                            ).toLocaleDateString("fr-FR")}{" "}
                                            -{" "}
                                            {new Date(
                                                charge.endDate
                                            ).toLocaleDateString("fr-FR")}
                                        </p>
                                    )}
                                {charge.description && (
                                    <p className="mt-1">
                                        Description: {charge.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <Link to={`/charges/${charge.id}`}>
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
                                    onClick={() => handleDelete(charge)}
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
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Montant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Période
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {charges.map((charge) => (
                            <tr key={charge.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {getChargeTypeLabel(charge.type)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {charge.amount.toFixed(2)} €
                                    {charge.waterUnitPrice && (
                                        <span className="text-sm text-gray-500 ml-2">
                                            ({charge.waterUnitPrice} €/m³)
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(charge.date).toLocaleDateString(
                                        "fr-FR"
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {charge.type !== "OTHER" &&
                                    charge.startDate &&
                                    charge.endDate ? (
                                        <>
                                            {new Date(
                                                charge.startDate
                                            ).toLocaleDateString("fr-FR")}{" "}
                                            -{" "}
                                            {new Date(
                                                charge.endDate
                                            ).toLocaleDateString("fr-FR")}
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {charge.description || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/charges/${charge.id}`}
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
                                        onClick={() => handleDelete(charge)}
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
                open={!!chargeToDelete}
                onOpenChange={() => setChargeToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. La charge de{" "}
                            {chargeToDelete?.amount}€ sera définitivement
                            supprimée.
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
