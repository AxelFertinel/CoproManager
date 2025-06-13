import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { ChargeType } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { chargesService } from "../../services/charges";

const chargeSchema = z
    .object({
        amount: z.number().min(0, "Le montant doit être positif"),
        date: z.string().refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, "Date de facturation invalide"),
        startDate: z.string().refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, "Date de début invalide"),
        endDate: z.string().refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, "Date de fin invalide"),
        type: z.nativeEnum(ChargeType),
        description: z.string().optional(),
        waterUnitPrice: z
            .number()
            .min(0, "Le prix unitaire doit être positif")
            .optional(),
    })
    .refine(
        (data) => {
            if (
                data.type === ChargeType.WATER &&
                (!data.waterUnitPrice || data.waterUnitPrice <= 0)
            ) {
                return false;
            }
            return true;
        },
        {
            message: "Le prix unitaire est requis pour les factures d'eau",
            path: ["waterUnitPrice"],
        }
    );

type ChargeFormData = z.infer<typeof chargeSchema>;

export default function ChargeFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: charge, isLoading: isChargeLoading } = useQuery({
        queryKey: ["charges", id],
        queryFn: () => chargesService.getById(id!),
        enabled: !!id,
    });
    console.log("🇧🇳 charge:", charge);

    const formatDateForInput = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.error("Invalid date:", dateString);
                return "";
            }
            return date.toISOString().split("T")[0];
        } catch (error) {
            console.error("Error formatting date:", dateString, error);
            return "";
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
    } = useForm<ChargeFormData>({
        resolver: zodResolver(chargeSchema),
    });

    useEffect(() => {
        if (charge) {
            reset({
                amount: charge.amount,
                date: formatDateForInput(charge.date),
                startDate: formatDateForInput(charge.startDate),
                endDate: formatDateForInput(charge.endDate),
                type: charge.type,
                description: charge.description || "",
                waterUnitPrice: charge.waterUnitPrice,
            });
        }
    }, [charge, reset]);

    const createChargeMutation = useMutation({
        mutationFn: chargesService.create,
        onSuccess: () => {
            toast.success("Charge créée avec succès");
            navigate("/charges");
        },
        onError: (error) => {
            toast.error("Erreur lors de la création de la charge");
            console.error(error);
        },
    });

    const updateChargeMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: ChargeFormData }) =>
            chargesService.update(id, data),
        onSuccess: () => {
            toast.success("Charge mise à jour avec succès");
            navigate("/charges");
        },
        onError: (error) => {
            toast.error("Erreur lors de la mise à jour de la charge");
            console.error(error);
        },
    });

    const onSubmit = (data: ChargeFormData) => {
        if (id) {
            updateChargeMutation.mutate({ id, data });
        } else {
            createChargeMutation.mutate(data);
        }
    };

    if (isChargeLoading) {
        return (
            <div className="text-center py-10">Chargement de la charge...</div>
        );
    }

    return (
        <div className="mx-auto py-10">
            <Card className="bg-white shadow-lg max-w-2xl mx-auto">
                <CardHeader className="space-y-1 border-b pb-6">
                    <CardTitle className="text-2xl font-bold">
                        {id ? "Modifier la charge" : "Nouvelle charge"}
                    </CardTitle>
                    <p className="text-muted-foreground">
                        {id
                            ? "Modifiez les informations de la charge"
                            : "Remplissez les informations pour créer une nouvelle charge"}
                    </p>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <label
                                    htmlFor="amount"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Montant
                                </label>
                                <input
                                    {...register("amount", {
                                        valueAsNumber: true,
                                    })}
                                    type="number"
                                    step="0.01"
                                    className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    placeholder="0.00"
                                />
                                {errors.amount && (
                                    <p className="text-red-500 text-sm">
                                        {errors.amount.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label
                                    htmlFor="date"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Date de Facturation
                                </label>
                                <input
                                    {...register("date")}
                                    type="date"
                                    className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                />
                                {errors.date && (
                                    <p className="text-red-500 text-sm">
                                        {errors.date.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label
                                    htmlFor="startDate"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Date de Début de Période
                                </label>
                                <input
                                    {...register("startDate")}
                                    type="date"
                                    className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                />
                                {errors.startDate && (
                                    <p className="text-red-500 text-sm">
                                        {errors.startDate.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label
                                    htmlFor="endDate"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Date de Fin de Période
                                </label>
                                <input
                                    {...register("endDate")}
                                    type="date"
                                    className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                />
                                {errors.endDate && (
                                    <p className="text-red-500 text-sm">
                                        {errors.endDate.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label
                                    htmlFor="type"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Type de charge
                                </label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                                <SelectValue placeholder="Sélectionner un type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value={ChargeType.WATER}
                                                >
                                                    Eau
                                                </SelectItem>
                                                <SelectItem
                                                    value={ChargeType.INSURANCE}
                                                >
                                                    Assurance
                                                </SelectItem>
                                                <SelectItem
                                                    value={ChargeType.BANK}
                                                >
                                                    Frais bancaires
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.type && (
                                    <p className="text-red-500 text-sm">
                                        {errors.type.message}
                                    </p>
                                )}
                            </div>

                            {watch("type") === ChargeType.WATER && (
                                <div className="grid gap-2">
                                    <label
                                        htmlFor="waterUnitPrice"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Prix unitaire de l'eau (€/m³)
                                    </label>
                                    <Controller
                                        name="waterUnitPrice"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                step="any"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            />
                                        )}
                                    />
                                    {errors.waterUnitPrice && (
                                        <p className="text-red-500 text-sm">
                                            {errors.waterUnitPrice.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="grid gap-2">
                                <label
                                    htmlFor="description"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Description (optionnel)
                                </label>
                                <textarea
                                    {...register("description")}
                                    className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    rows={4}
                                    placeholder="Description de la charge"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 border-t pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/charges")}
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
