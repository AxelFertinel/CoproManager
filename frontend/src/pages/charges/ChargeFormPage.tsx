import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Input } from "../../components/ui/Input";
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
} from "../../components/ui/Select";
import { ChargeType } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { chargesService } from "../../services/charges";

const chargeSchema = z
    .object({
        type: z.nativeEnum(ChargeType, {
            required_error: "Le type de charge est obligatoire",
        }),
        amount: z.preprocess(
            (val) => {
                if (val === "" || val === null || val === undefined)
                    return undefined;
                const num = Number(val);
                return isNaN(num) ? undefined : num;
            },
            z
                .number({
                    required_error: "Le montant est obligatoire",
                })
                .min(0, "Le montant doit être positif")
        ),
        date: z.string().refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, "Date de facturation est obligatoire"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        description: z.string().optional(),
        waterUnitPrice: z.preprocess((val) => {
            if (val === "" || val === undefined || val === null)
                return undefined;
            if (typeof val === "string") {
                const normalized = val.replace(",", ".");
                const num = Number(normalized);
                return isNaN(num) ? val : num;
            }
            return val;
        }, z.number().min(0, "Le prix unitaire doit être positif").optional()),
    })
    .superRefine((data, ctx) => {
        if (
            data.type === ChargeType.WATER &&
            (!data.waterUnitPrice || data.waterUnitPrice <= 0)
        ) {
            ctx.addIssue({
                path: ["waterUnitPrice"],
                message: "Le prix unitaire est requis pour une charge d’eau",
                code: z.ZodIssueCode.custom,
            });
        }

        if (
            data.type !== ChargeType.OTHER &&
            (!data.startDate || !data.endDate)
        ) {
            if (!data.startDate) {
                ctx.addIssue({
                    path: ["startDate"],
                    message:
                        "La date de début est requise pour ce type de charge",
                    code: z.ZodIssueCode.custom,
                });
            }
            if (!data.endDate) {
                ctx.addIssue({
                    path: ["endDate"],
                    message:
                        "La date de fin est requise pour ce type de charge",
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        if (data.startDate && data.endDate) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            if (end < start) {
                ctx.addIssue({
                    path: ["endDate"],
                    message:
                        "La date de fin ne peut pas être antérieure à la date de début",
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });

type ChargeFormData = z.infer<typeof chargeSchema>;

export default function ChargeFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: charge, isLoading: isChargeLoading } = useQuery({
        queryKey: ["charges", id],
        queryFn: () => chargesService.getById(id!),
        enabled: !!id,
    });

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
                startDate: charge.startDate
                    ? formatDateForInput(charge.startDate)
                    : undefined,
                endDate: charge.endDate
                    ? formatDateForInput(charge.endDate)
                    : undefined,
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
        const { startDate, endDate, ...baseData } = data;
        const formattedData = {
            ...baseData,
            date: new Date(data.date).toISOString(),
            startDate: startDate
                ? new Date(startDate).toISOString()
                : undefined,
            endDate: endDate ? new Date(endDate).toISOString() : undefined,
        };

        if (id) {
            updateChargeMutation.mutate({ id, data: formattedData });
        } else {
            createChargeMutation.mutate(formattedData);
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
                    <p className="text-red-500">
                        Les champs requis sont marqués d'un astérisque (*)
                    </p>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <label
                                    htmlFor="type"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Type de charge *
                                </label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
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
                                                <SelectItem
                                                    value={ChargeType.OTHER}
                                                >
                                                    Autre
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
                            {watch("type") && (
                                <>
                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="amount"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Montant en €
                                            {watch("type") ===
                                                ChargeType.INSURANCE ||
                                            watch("type") === ChargeType.BANK
                                                ? " par mois"
                                                : ""}
                                            &nbsp;*
                                        </label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...register("amount")}
                                            error={errors.amount?.message}
                                        />
                                    </div>
                                    {watch("type") === ChargeType.WATER && (
                                        <div className="grid gap-2">
                                            <label
                                                htmlFor="waterUnitPrice"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Prix unitaire de l'eau (€/m³) *
                                            </label>
                                            <Controller
                                                name="waterUnitPrice"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="text"
                                                        pattern="[0-9]*[.,]?[0-9]*"
                                                        value={
                                                            field.value ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value
                                                            )
                                                        }
                                                        onBlur={field.onBlur}
                                                    />
                                                )}
                                            />
                                            {errors.waterUnitPrice && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors.waterUnitPrice
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="date"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Date de Facturation *
                                        </label>
                                        <Input
                                            {...register("date")}
                                            type="date"
                                        />
                                        {errors.date && (
                                            <p className="text-red-500 text-sm">
                                                {errors.date.message}
                                            </p>
                                        )}
                                    </div>

                                    {watch("type") !== ChargeType.OTHER && (
                                        <>
                                            <div className="grid gap-2">
                                                <label
                                                    htmlFor="startDate"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Date de Début de Période *
                                                </label>
                                                <Input
                                                    {...register("startDate")}
                                                    type="date"
                                                />
                                                {errors.startDate && (
                                                    <p className="text-red-500 text-sm">
                                                        {
                                                            errors.startDate
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid gap-2">
                                                <label
                                                    htmlFor="endDate"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Date de Fin de Période *
                                                </label>
                                                <Input
                                                    {...register("endDate")}
                                                    type="date"
                                                />
                                                {errors.endDate && (
                                                    <p className="text-red-500 text-sm">
                                                        {errors.endDate.message}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="description"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            {...register("description")}
                                            rows={4}
                                            placeholder="Description de la charge"
                                            className="flex h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                </>
                            )}
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
                        <Button type="submit" disabled={!watch("type")}>
                            {id ? "Mettre à jour" : "Créer"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
