import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUsers, deleteUser } from "../../services/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/Card";
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
import { Button } from "../../components/ui/Button";

export default function UsersListPage() {
    const queryClient = useQueryClient();
    const {
        data: users,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Copropriétaire supprimé avec succès");
        },
        onError: (error) => {
            toast.error("Erreur lors de la suppression du copropriétaire");
            console.error(error);
        },
    });

    if (error) {
        toast.error("Erreur lors du chargement des copropriétaires");
        return null;
    }

    return (
        <div className="container">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Liste des copropriétaires
                </h1>
                <Link
                    to="/users/new"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    Ajouter un copropriétaire
                </Link>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            ) : users && users.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-lg text-muted-foreground">
                        Aucun copropriétaire trouvé. Ajoutez un nouveau
                        copropriétaire pour commencer.
                    </p>
                    <Link
                        to="/users/new"
                        className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Ajouter un copropriétaire
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {users?.map((user) => (
                        <Card
                            key={user.id}
                            className="h-full transition-colors hover:bg-accent"
                        >
                            <CardHeader>
                                <CardTitle>{user.name}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Tantième
                                        </dt>
                                        <dd>{user.tantieme}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Avance
                                        </dt>
                                        <dd>{user.advanceCharges}€</dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Compteur d'eau
                                        </dt>
                                        <dd>
                                            {user.waterMeterOld} →{" "}
                                            {user.waterMeterNew}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Dernière mise à jour
                                        </dt>
                                        <dd>
                                            {new Date(
                                                user.updatedAt
                                            ).toLocaleDateString("fr-FR")}
                                        </dd>
                                    </div>
                                </dl>
                            </CardContent>
                            <div className="flex justify-end p-6 space-x-2">
                                <Link
                                    to={`/users/${user.id}/edit`}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                >
                                    Modifier
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            disabled={
                                                deleteUserMutation.isPending
                                            }
                                        >
                                            Supprimer
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Êtes-vous absolument sûr ?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Cette action ne peut pas être
                                                annulée. Cela supprimera
                                                définitivement cet utilisateur
                                                et toutes les données associées
                                                de nos serveurs.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Annuler
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    deleteUserMutation.mutate(
                                                        user.id
                                                    )
                                                }
                                            >
                                                Continuer
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
