import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/Card";
import { usersService } from "../../services/users";
import { CreateUserData, UpdateUserData, User } from "../../types/user";
import { Button } from "../../components/ui/Button";
import { authService } from "../../services/auth.service";

// Schema for form data, matches CreateUserData fields
const userFormSchema = z.object({
    email: z.string().email("Email invalide"),
    name: z.string().min(1, "Le nom est requis"),
    tantieme: z.number().min(0, "Le tantième doit être positif"),
    advanceCharges: z.number().min(0, "L'avance doit être positive"),
    waterMeterOld: z.number().min(0, "Le compteur d'eau doit être positif"),
    waterMeterNew: z.number().min(0, "Le compteur d'eau doit être positif"),
});

type UserFormData = z.infer<typeof userFormSchema>;

const defaultUserFormData: UserFormData = {
    email: "",
    name: "",
    tantieme: 0,
    advanceCharges: 0,
    waterMeterOld: 0,
    waterMeterNew: 0,
};

export default function UserFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user, isLoading: isUserLoading } = useQuery<User, Error>({
        queryKey: ["users", id],
        queryFn: () => usersService.getById(Number(id)),
        enabled: !!id,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: defaultUserFormData,
    });

    useEffect(() => {
        if (user) {
            reset({
                email: user.email,
                name: user.name,
                tantieme: user.tantieme,
                advanceCharges: user.advanceCharges,
                waterMeterOld: user.waterMeterOld,
                waterMeterNew: user.waterMeterNew,
            });
        }
    }, [user, reset]);

    // Mutation for creating a user
    const createUserMutation = useMutation<User, Error, CreateUserData>({
        mutationFn: usersService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Utilisateur créé avec succès");
            navigate("/copropriete"); // Updated path
        },
        onError: (error) => {
            toast.error("Erreur lors de la création de l'utilisateur");
            console.error(error);
        },
    });

    // Mutation for updating a user
    const updateUserMutation = useMutation<
        User,
        Error,
        { id: number; data: UpdateUserData }
    >({
        mutationFn: ({ id, data }) => usersService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Utilisateur mis à jour avec succès");
            navigate("/copropriete");
        },
        onError: (error) => {
            toast.error("Erreur lors de la mise à jour de l'utilisateur");
            console.error(error);
        },
    });

    const onSubmit = (data: UserFormData) => {
        if (id) {
            updateUserMutation.mutate({
                id: Number(id),
                data: data as UpdateUserData,
            });
        } else {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                createUserMutation.mutate({
                    ...(data as CreateUserData),
                    coproprieteId: currentUser.coproprieteId || currentUser.id,
                    role: "basic",
                });
            } else {
                toast.error("Erreur: Utilisateur non connecté.");
            }
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
                                Ancien Index Compteur d'Eau
                            </label>
                            <input
                                {...register("waterMeterOld", {
                                    valueAsNumber: true,
                                })}
                                type="number"
                                step="any"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Ancien index"
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
                                Nouvel Index Compteur d'Eau
                            </label>
                            <input
                                {...register("waterMeterNew", {
                                    valueAsNumber: true,
                                })}
                                type="number"
                                step="any"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Nouvel index"
                            />
                            {errors.waterMeterNew && (
                                <p className="text-sm text-destructive">
                                    {errors.waterMeterNew.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button type="submit">
                            {id ? "Mettre à jour" : "Créer"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
