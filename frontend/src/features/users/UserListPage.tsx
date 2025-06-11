import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from "../../components/ui/Card";
import { usersService } from "../../services/users";
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

export default function UserListPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: usersService.getAll,
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id: number) => usersService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Utilisateur supprimé avec succès");
        },
        onError: (error) => {
            toast.error("Erreur lors de la suppression de l'utilisateur");
            console.error(error);
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Copropriétaires
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez les copropriétaires et leurs informations
                    </p>
                </div>
                <Button onClick={() => navigate("/copropriete/new")}>
                    Ajouter un copropriétaire
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users?.map((user) => (
                    <Card
                        key={user.id}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {user.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        Tantième
                                    </span>
                                    <span className="font-medium">
                                        {user.tantieme}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        Avance sur charges
                                    </span>
                                    <span className="font-medium">
                                        {user.advanceCharges}€/mois
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        Compteur d'eau
                                    </span>
                                    <span className="font-medium">
                                        {user.waterMeterOld} →{" "}
                                        {user.waterMeterNew} m³
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    navigate(`/copropriete/${user.id}`)
                                }
                            >
                                Modifier
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            deleteUserMutation.mutate(user.id)
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
                                            définitivement cet utilisateur de
                                            nos serveurs.
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
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
