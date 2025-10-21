import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { logementsService } from "../../services/logements";
import {
    Logement,
    CreateLogementData,
    UpdateLogementData,
} from "../../types/logement";
import { authService } from "../../services/auth.service";

const positiveNumberField = (fieldLabel: string) =>
    z.preprocess(
        (val) => {
            if (val === "" || val === null || val === undefined)
                return undefined;
            const num = Number(val);
            return isNaN(num) ? undefined : num;
        },
        z
            .number({
                required_error: `${fieldLabel} est requis`,
                invalid_type_error: `${fieldLabel} doit être un nombre`,
            })
            .min(0, `${fieldLabel} doit être positif`)
    );

export const logementFormSchema = z
    .object({
        name: z.string().min(1, "Le nom est requis"),
        email: z.string().email("L'email est invalide"),
        tantieme: positiveNumberField("Le tantième"),
        advanceCharges: positiveNumberField("Les provisions sur charges"),
        waterMeterOld: positiveNumberField("L'ancien relevé du compteur d’eau"),
        waterMeterNew: positiveNumberField(
            "Le nouveau relevé du compteur d’eau"
        ),
    })
    .superRefine((data, ctx) => {
        if (data.waterMeterOld && data.waterMeterNew) {
            if (data.waterMeterNew <= data.waterMeterOld) {
                ctx.addIssue({
                    path: ["waterMeterNew"],
                    message:
                        "Le nouveau relevé ne peut pas être inférieur ou égal à l'ancien",
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });

type LogementFormData = z.infer<typeof logementFormSchema>;

export default function LogementFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LogementFormData>({
        resolver: zodResolver(logementFormSchema),
    });

    const { data: logement } = useQuery<Logement>({
        queryKey: ["logement", id],
        queryFn: () => logementsService.getById(Number(id)),
        enabled: !!id,
    });

    useEffect(() => {
        if (logement) {
            reset({
                name: logement.name,
                email: logement.email,
                tantieme: logement.tantieme,
                advanceCharges: logement.advanceCharges,
                waterMeterOld: logement.waterMeterOld,
                waterMeterNew: logement.waterMeterNew,
            });
        }
    }, [logement, reset]);

    const createLogementMutation = useMutation({
        mutationFn: (data: CreateLogementData) => logementsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logements"] });
            toast.success("Logement créé avec succès");
            navigate("/logement");
        },
        onError: (error) => {
            toast.error("Erreur lors de la création du logement");
            console.error(error);
        },
    });

    const updateLogementMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateLogementData }) =>
            logementsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logements"] });
            toast.success("Logement mis à jour avec succès");
            navigate("/logement");
        },
        onError: (error) => {
            toast.error("Erreur lors de la mise à jour du logement");
            console.error(error);
        },
    });

    const onSubmit = (data: LogementFormData) => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            toast.error("Erreur: Utilisateur non connecté.");
            return;
        }

        if (id) {
            updateLogementMutation.mutate({
                id: Number(id),
                data: {
                    ...data,
                    coproprieteId: currentUser.coproprieteId,
                },
            });
        } else {
            createLogementMutation.mutate({
                ...data,
                coproprieteId: currentUser.coproprieteId,
            });
        }
    };

    return (
        <div>
            <Card className="bg-white shadow-lg max-w-2xl mx-auto">
                <CardHeader className="space-y-1 border-b pb-6">
                    <CardTitle className="text-2xl font-bold">
                        {id ? "Modifier le logement" : "Nouveau logement"}
                    </CardTitle>
                    <CardDescription>
                        {id
                            ? "Modifiez les informations du logement"
                            : "Remplissez les informations pour créer un nouveau logement"}
                        <p className="text-red-500">
                            Les champs requis sont marqués d'un astérisque (*)
                        </p>
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom *</Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    error={errors.name?.message}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    error={errors.email?.message}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tantieme">Tantième *</Label>
                                <Input
                                    id="tantieme"
                                    type="number"
                                    step="0.01"
                                    {...register("tantieme", {
                                        valueAsNumber: true,
                                    })}
                                    error={errors.tantieme?.message}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="advanceCharges">
                                    Avance sur charges *
                                </Label>
                                <Input
                                    id="advanceCharges"
                                    type="number"
                                    step="0.01"
                                    {...register("advanceCharges", {
                                        valueAsNumber: true,
                                    })}
                                    error={errors.advanceCharges?.message}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="waterMeterOld">
                                    Ancien compteur d'eau *
                                </Label>
                                <Input
                                    id="waterMeterOld"
                                    type="number"
                                    step="0.001"
                                    {...register("waterMeterOld", {
                                        valueAsNumber: true,
                                    })}
                                    error={errors.waterMeterOld?.message}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="waterMeterNew">
                                    Nouveau compteur d'eau *
                                </Label>
                                <Input
                                    id="waterMeterNew"
                                    type="number"
                                    step="0.001"
                                    {...register("waterMeterNew", {
                                        valueAsNumber: true,
                                    })}
                                    error={errors.waterMeterNew?.message}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 border-t pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/logement")}
                        >
                            Annuler
                        </Button>
                        <Button type="submit">
                            {id ? "Mettre à jour" : "Créer"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
