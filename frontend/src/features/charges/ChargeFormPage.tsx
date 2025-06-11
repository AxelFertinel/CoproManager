import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
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

const chargeSchema = z.object({
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
});

type ChargeFormData = z.infer<typeof chargeSchema>;

export default function ChargeFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: charge, isLoading: isChargeLoading } = useQuery({
        queryKey: ["charges", id],
        queryFn: () => chargesService.getById(Number(id)),
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
        values: charge
            ? {
                  ...charge,
                  date: formatDateForInput(charge.date),
                  startDate: formatDateForInput(charge.startDate),
                  endDate: formatDateForInput(charge.endDate),
                  waterUnitPrice: charge.waterUnitPrice,
              }
            : undefined,
    });

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
        mutationFn: ({ id, data }: { id: number; data: ChargeFormData }) =>
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
            updateChargeMutation.mutate({ id: Number(id), data });
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
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">
                    {charge ? "Modifier la facture" : "Nouvelle facture"}
                </h1>
                <Button variant="outline" onClick={() => navigate("/charges")}>
                    Retour à la liste
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {id
                            ? "Modifier une charge"
                            : "Ajouter une nouvelle charge"}
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="amount"
                                className="text-sm font-medium"
                            >
                                Montant
                            </label>
                            <input
                                {...register("amount", { valueAsNumber: true })}
                                type="number"
                                step="0.01"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="0.00"
                            />
                            {errors.amount && (
                                <p className="text-sm text-destructive">
                                    {errors.amount.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="date"
                                className="text-sm font-medium"
                            >
                                Date de Facturation
                            </label>
                            <input
                                {...register("date")}
                                type="date"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            {errors.date && (
                                <p className="text-sm text-destructive">
                                    {errors.date.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="startDate"
                                className="text-sm font-medium"
                            >
                                Date de Début de Période
                            </label>
                            <input
                                {...register("startDate")}
                                type="date"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            {errors.startDate && (
                                <p className="text-sm text-destructive">
                                    {errors.startDate.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="endDate"
                                className="text-sm font-medium"
                            >
                                Date de Fin de Période
                            </label>
                            <input
                                {...register("endDate")}
                                type="date"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            {errors.endDate && (
                                <p className="text-sm text-destructive">
                                    {errors.endDate.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type de charge</Label>
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
                                            <SelectItem value={ChargeType.BANK}>
                                                Frais bancaires
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.type && (
                                <p className="text-sm text-destructive">
                                    {errors.type.message}
                                </p>
                            )}
                        </div>

                        {/* Water Unit Price Input - Only show if type is WATER */}
                        {watch("type") === ChargeType.WATER && (
                            <div className="space-y-2">
                                <Label htmlFor="waterUnitPrice">
                                    Prix unitaire de l'eau (€/m³)
                                </Label>
                                <Controller
                                    name="waterUnitPrice"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            step="any"
                                            {...field}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                            error={
                                                errors.waterUnitPrice?.message
                                            }
                                        />
                                    )}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Description (optionnel)
                            </label>
                            <textarea
                                {...register("description")}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                rows={4}
                                placeholder="Description de la charge"
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => navigate("/charges")}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {id ? "Mettre à jour" : "Créer"}
                        </button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
