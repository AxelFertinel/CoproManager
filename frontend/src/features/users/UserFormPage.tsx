import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUser, updateUser } from "../../services/api";
import { toast } from "react-toastify";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/Card";

const userSchema = z.object({
    email: z.string().email("Email invalide"),
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    tantieme: z.number().min(0, "Le tantieme doit être positif"),
    advanceCharges: z.number().min(0, "L'avance doit être positive"),
    waterMeterOld: z.number().min(0, "Le compteur d'eau doit être positif"),
    waterMeterNew: z.number().min(0, "Le compteur d'eau doit être positif"),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ["users", id],
        queryFn: () => getUser(Number(id)),
        enabled: !!id,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        values: user || undefined,
    });

    const createUserMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Utilisateur créé avec succès");
            navigate("/users");
        },
        onError: (error) => {
            toast.error("Erreur lors de la création de l'utilisateur");
            console.error(error);
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UserFormData }) =>
            updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Utilisateur mis à jour avec succès");
            navigate("/users");
        },
        onError: (error) => {
            toast.error("Erreur lors de la mise à jour de l'utilisateur");
            console.error(error);
        },
    });

    const onSubmit = (data: UserFormData) => {
        if (id) {
            updateUserMutation.mutate({ id: Number(id), data });
        } else {
            createUserMutation.mutate(data);
        }
    };

    if (isUserLoading) {
        return (
            <div className="text-center py-10">
                Chargement de l'utilisateur...
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">
                    {id
                        ? "Modifier le Copropriétaire"
                        : "Ajouter un Copropriétaire"}
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {id
                            ? "Modifier Copropriétaire"
                            : "Ajouter un copropriétaire"}
                    </CardTitle>
                    <CardDescription>
                        {id
                            ? "Modifiez les informations du copropriétaire"
                            : "Ajoutez un nouveau copropriétaire à la copropriété"}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="email@example.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                Nom
                            </label>
                            <input
                                {...register("name")}
                                type="text"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Nom du copropriétaire"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="tantieme"
                                className="text-sm font-medium"
                            >
                                Tantième
                            </label>
                            <input
                                {...register("tantieme", {
                                    valueAsNumber: true,
                                })}
                                type="number"
                                step="any"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Tantième"
                            />
                            {errors.tantieme && (
                                <p className="text-sm text-destructive">
                                    {errors.tantieme.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="advanceCharges"
                                className="text-sm font-medium"
                            >
                                Avance de Charges
                            </label>
                            <input
                                {...register("advanceCharges", {
                                    valueAsNumber: true,
                                })}
                                type="number"
                                step="any"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Avance de charges"
                            />
                            {errors.advanceCharges && (
                                <p className="text-sm text-destructive">
                                    {errors.advanceCharges.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="waterMeterOld"
                                className="text-sm font-medium"
                            >
                                Ancien Compteur d'Eau
                            </label>
                            <input
                                {...register("waterMeterOld", {
                                    valueAsNumber: true,
                                })}
                                type="number"
                                step="any"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Ancien compteur d'eau"
                            />
                            {errors.waterMeterOld && (
                                <p className="text-sm text-destructive">
                                    {errors.waterMeterOld.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="waterMeterNew"
                                className="text-sm font-medium"
                            >
                                Nouveau Compteur d'Eau
                            </label>
                            <input
                                {...register("waterMeterNew", {
                                    valueAsNumber: true,
                                })}
                                type="number"
                                step="any"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Nouveau compteur d'eau"
                            />
                            {errors.waterMeterNew && (
                                <p className="text-sm text-destructive">
                                    {errors.waterMeterNew.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate("/users")}
                            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={
                                createUserMutation.isPending ||
                                updateUserMutation.isPending
                            }
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            {id
                                ? updateUserMutation.isPending
                                    ? "Modification..."
                                    : "Modifier"
                                : createUserMutation.isPending
                                ? "Création..."
                                : "Créer"}
                        </button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
