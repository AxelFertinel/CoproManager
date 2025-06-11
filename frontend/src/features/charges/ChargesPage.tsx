import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
} from "../../components/ui/Card";
import { chargesService } from "../../services/charges";
import { toast } from "react-toastify";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../components/ui/AlertDialog";
import { Charge } from "../../services/api";

export default function ChargesPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: charges, isLoading } = useQuery<Charge[], Error>({
        queryKey: ["charges"],
        queryFn: chargesService.getAll,
    });

    const deleteChargeMutation = useMutation({
        mutationFn: chargesService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["charges"] });
            toast.success("Charge supprimée avec succès");
        },
        onError: (error) => {
            toast.error("Erreur lors de la suppression de la charge");
            console.error(error);
        },
    });

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.error("Invalid date:", dateString);
                return "Date invalide";
            }
            return date.toLocaleDateString("fr-FR");
        } catch (error) {
            console.error("Error formatting date:", dateString, error);
            return "Date invalide";
        }
    };

    return (
        <div className="container">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Liste des factures de la copropriété
                </h1>
                <Button onClick={() => navigate("/charges/new")}>
                    Ajouter une facture
                </Button>
            </div>

            {charges && charges.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-lg text-muted-foreground">
                        Aucune charge trouvée. Ajoutez une nouvelle charge pour
                        commencer.
                    </p>
                    <Button onClick={() => navigate("/charges/new")}>
                        Ajouter une facture
                    </Button>
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-4">Factures d'Eau</h2>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        {charges
                            ?.filter((charge) => charge.type === "WATER")
                            .map((charge) => (
                                <Card
                                    key={charge.id}
                                    className="hover:bg-accent"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Facture d'eau
                                        </CardTitle>
                                        <CardDescription>
                                            {charge.description && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    {charge.description}
                                                </div>
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Montant
                                                </p>
                                                <p>
                                                    {charge.amount}€
                                                    {charge.waterUnitPrice && (
                                                        <span className="text-sm text-gray-500 ml-2">
                                                            (
                                                            {
                                                                charge.waterUnitPrice
                                                            }
                                                            €/m³)
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Date de facturation
                                                </p>
                                                <p>{formatDate(charge.date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Période de début
                                                </p>
                                                <p>
                                                    {formatDate(
                                                        charge.startDate
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Période de fin
                                                </p>
                                                <p>
                                                    {formatDate(charge.endDate)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                navigate(
                                                    `/charges/${charge.id}/edit`
                                                )
                                            }
                                        >
                                            Modifier
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    disabled={
                                                        deleteChargeMutation.isPending
                                                    }
                                                >
                                                    Supprimer
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Êtes-vous absolument sûr
                                                        ?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action ne peut pas
                                                        être annulée. Cela
                                                        supprimera
                                                        définitivement cette
                                                        charge et toutes les
                                                        données associées de nos
                                                        serveurs.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Annuler
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            deleteChargeMutation.mutate(
                                                                charge.id
                                                            )
                                                        }
                                                    >
                                                        Continuer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>

                    <h2 className="text-xl font-bold mb-4">
                        Factures d'Assurance
                    </h2>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        {charges
                            ?.filter((charge) => charge.type === "INSURANCE")
                            .map((charge) => (
                                <Card
                                    key={charge.id}
                                    className="hover:bg-accent"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Facture d'assurance
                                        </CardTitle>
                                        <CardDescription>
                                            {charge.description && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    {charge.description}
                                                </div>
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Montant
                                                </p>
                                                <p>{charge.amount}€</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Date de facturation
                                                </p>
                                                <p>{formatDate(charge.date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Période de début
                                                </p>
                                                <p>
                                                    {formatDate(
                                                        charge.startDate
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Période de fin
                                                </p>
                                                <p>
                                                    {formatDate(charge.endDate)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                navigate(
                                                    `/charges/${charge.id}/edit`
                                                )
                                            }
                                        >
                                            Modifier
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    disabled={
                                                        deleteChargeMutation.isPending
                                                    }
                                                >
                                                    Supprimer
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Êtes-vous absolument sûr
                                                        ?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action ne peut pas
                                                        être annulée. Cela
                                                        supprimera
                                                        définitivement cette
                                                        charge et toutes les
                                                        données associées de nos
                                                        serveurs.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Annuler
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            deleteChargeMutation.mutate(
                                                                charge.id
                                                            )
                                                        }
                                                    >
                                                        Continuer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>

                    <h2 className="text-xl font-bold mb-4">
                        Factures Bancaires
                    </h2>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {charges
                            ?.filter((charge) => charge.type === "BANK")
                            .map((charge) => (
                                <Card
                                    key={charge.id}
                                    className="hover:bg-accent"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Frais bancaires
                                        </CardTitle>
                                        <CardDescription>
                                            {charge.description && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    {charge.description}
                                                </div>
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Montant
                                                </p>
                                                <p>{charge.amount}€</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Date de facturation
                                                </p>
                                                <p>{formatDate(charge.date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Période de début
                                                </p>
                                                <p>
                                                    {formatDate(
                                                        charge.startDate
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Période de fin
                                                </p>
                                                <p>
                                                    {formatDate(charge.endDate)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                navigate(
                                                    `/charges/${charge.id}/edit`
                                                )
                                            }
                                        >
                                            Modifier
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    disabled={
                                                        deleteChargeMutation.isPending
                                                    }
                                                >
                                                    Supprimer
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Êtes-vous absolument sûr
                                                        ?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action ne peut pas
                                                        être annulée. Cela
                                                        supprimera
                                                        définitivement cette
                                                        charge et toutes les
                                                        données associées de nos
                                                        serveurs.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Annuler
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            deleteChargeMutation.mutate(
                                                                charge.id
                                                            )
                                                        }
                                                    >
                                                        Continuer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}
