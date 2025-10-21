import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getLogements, deleteLogement } from "../../services/api";
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
import { useNavigate } from "react-router-dom";

export default function LogementsListPage() {
    const queryClient = useQueryClient();
    const {
        data: logements,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["logements"],
        queryFn: getLogements,
    });

    const deleteLogementMutation = useMutation({
        mutationFn: deleteLogement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logements"] });
            toast.success("Logement supprimé avec succès");
        },
        onError: (error) => {
            toast.error("Erreur lors de la suppression du logement");
            console.error(error);
        },
    });

    const navigate = useNavigate();

    if (error) {
        toast.error("Erreur lors du chargement des logements");
        return null;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Liste des Logements</h1>
                <Button onClick={() => navigate("/logements/new")}>
                    Ajouter un logement
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            ) : logements && logements.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">
                        Aucun logement trouvé. Ajoutez un nouveau logement pour
                        commencer.
                    </p>
                    <Link
                        to="/logements/new"
                        className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Ajouter un logement
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {logements?.map((logement) => (
                        <Card
                            key={logement.id}
                            className="h-full transition-colors hover:bg-accent"
                        >
                            <CardHeader>
                                <CardTitle>{logement.name}</CardTitle>
                                <CardDescription>
                                    {logement.user.email}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Tantième
                                        </dt>
                                        <dd>{logement.tantieme}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Avance
                                        </dt>
                                        <dd>{logement.advanceCharges}€</dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Compteur d'eau
                                        </dt>
                                        <dd>
                                            {logement.waterMeterOld} →{" "}
                                            {logement.waterMeterNew}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Dernière mise à jour
                                        </dt>
                                        <dd>
                                            {new Date(
                                                logement.updatedAt
                                            ).toLocaleDateString("fr-FR")}
                                        </dd>
                                    </div>
                                </dl>
                            </CardContent>
                            <div className="flex justify-end p-6 space-x-2">
                                <Link
                                    to={`/logements/${logement.id}/edit`}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                >
                                    Modifier
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            disabled={
                                                deleteLogementMutation.isPending
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
                                                définitivement ce logement et
                                                toutes les données associées de
                                                nos serveurs.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Annuler
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    deleteLogementMutation.mutate(
                                                        logement.id
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
