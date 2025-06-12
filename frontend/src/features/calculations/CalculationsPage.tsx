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
    CardDescription,
    CardFooter,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "@radix-ui/react-label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { api, Charge, ChargeType, User } from "../../services/api";
import { useState, useEffect } from "react";
import { usersService } from "../../services/users";
import { chargesService } from "../../services/charges";
import React from "react";
import jsPDF from "jspdf";

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

interface CalculationResult {
    user: {
        id: number;
        name: string;
        tantieme: number;
        advanceCharges: number; // monthly advance charge
        waterMeterOld: number;
        waterMeterNew: number;
    };
    totalWaterBill: number;
    waterUnitPrice: number;
    totalInsuranceAmount: number;
    totalBankFees: number;
    numberOfMonthsForAdvance: number;
    calculatedAdvance: number;
    calculatedWaterConsumption: number;
    calculatedInsuranceShare: number;
    calculatedBankFeesShare: number;
    totalCharges: number;
    finalBalance: number;
    status: "to_pay" | "to_reimburse" | "balanced";
}

const calculationSchema = z.object({
    waterBillId: z.string().optional(),
    insuranceBillId: z.string().optional(),
    bankFeesBillId: z.string().optional(),
    numberOfMonthsForAdvance: z
        .number()
        .min(1, "Le nombre de mois pour l'avance doit être d'au moins 1."),
});

type CalculationFormData = z.infer<typeof calculationSchema>;

export default function CalculationsPage() {
    const [results, setResults] = useState<CalculationResult[] | null>(null);

    const { data: users, isLoading: areUsersLoading } = useQuery<User[], Error>(
        {
            queryKey: ["users"],
            queryFn: usersService.getAll,
        }
    );

    const { data: charges, isLoading: areChargesLoading } = useQuery<
        Charge[],
        Error
    >({
        queryKey: ["charges"],
        queryFn: chargesService.getAll,
    });

    const waterCharges = React.useMemo(
        () =>
            charges?.filter((charge) => charge.type === ChargeType.WATER) || [],
        [charges]
    );
    const insuranceCharges = React.useMemo(
        () =>
            charges?.filter((charge) => charge.type === ChargeType.INSURANCE) ||
            [],
        [charges]
    );
    const bankCharges = React.useMemo(
        () =>
            charges?.filter((charge) => charge.type === ChargeType.BANK) || [],
        [charges]
    );

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<CalculationFormData>({
        resolver: zodResolver(calculationSchema),
        defaultValues: {
            numberOfMonthsForAdvance: 0,
            waterBillId: undefined,
            insuranceBillId: undefined,
            bankFeesBillId: undefined,
        },
    });

    useEffect(() => {
        if (charges && !areChargesLoading) {
            reset({
                numberOfMonthsForAdvance: 0,
                waterBillId:
                    waterCharges.length > 0
                        ? waterCharges[0]?.id.toString()
                        : undefined,
                insuranceBillId:
                    insuranceCharges.length > 0
                        ? insuranceCharges[0]?.id.toString()
                        : undefined,
                bankFeesBillId:
                    bankCharges.length > 0
                        ? bankCharges[0]?.id.toString()
                        : undefined,
            });
        }
    }, [
        charges,
        waterCharges,
        insuranceCharges,
        bankCharges,
        reset,
        areChargesLoading,
    ]);

    const runCalculationsMutation = useMutation({
        mutationFn: (data: CalculationFormData) => {
            const selectedWaterCharge = data.waterBillId
                ? waterCharges.find((c) => c.id === Number(data.waterBillId))
                : null;
            const totalWaterBill = selectedWaterCharge?.amount || 0;
            const waterUnitPrice = selectedWaterCharge?.waterUnitPrice || 0;

            const totalInsuranceAmount = data.insuranceBillId
                ? insuranceCharges.find(
                      (c) => c.id === Number(data.insuranceBillId)
                  )?.amount || 0
                : 0;
            const totalBankFees = data.bankFeesBillId
                ? bankCharges.find((c) => c.id === Number(data.bankFeesBillId))
                      ?.amount || 0
                : 0;

            return api
                .post<CalculationResult[]>("/calculations/run", {
                    totalWaterBill,
                    waterUnitPrice,
                    totalInsuranceAmount,
                    totalBankFees,
                    numberOfMonthsForAdvance: data.numberOfMonthsForAdvance,
                })
                .then((res) => res.data);
        },
        onSuccess: (data) => {
            setResults(data);
            toast.success("Calculs effectués avec succès.");
        },
        onError: (error) => {
            toast.error("Erreur lors de l'exécution des calculs.");
            console.error(error);
        },
    });

    const generatePDF = (results: CalculationResult[]) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        results.forEach((result) => {
            // Titre du copropriétaire
            doc.setFontSize(16);
            doc.text(`COPROPRIÉTAIRE ${result.user.name}`, pageWidth / 2, y, {
                align: "center",
            });
            y += 10;

            // Détails
            doc.setFontSize(12);
            doc.text(`Tantième : ${result.user.tantieme}%`, 20, y);
            y += 10;

            doc.text(
                `Avance sur charges : ${result.user.advanceCharges} × ${
                    result.numberOfMonthsForAdvance
                } mois = ${result.calculatedAdvance.toFixed(2)}€`,
                20,
                y
            );
            y += 10;

            doc.text(
                `Consommation eau : (${result.user.waterMeterNew} - ${
                    result.user.waterMeterOld
                }) × ${result.waterUnitPrice.toFixed(2)} = ${Math.abs(
                    result.calculatedWaterConsumption
                ).toFixed(2)}€`,
                20,
                y
            );
            y += 10;

            doc.text(
                `Assurance : (${result.totalInsuranceAmount.toFixed(
                    2
                )} ÷ 100) × ${
                    result.user.tantieme
                } = ${result.calculatedInsuranceShare.toFixed(2)}€`,
                20,
                y
            );
            y += 10;

            doc.text(
                `Frais bancaires : (${result.totalBankFees.toFixed(
                    2
                )} ÷ 100) × ${
                    result.user.tantieme
                } = ${result.calculatedBankFeesShare.toFixed(2)}€`,
                20,
                y
            );
            y += 10;

            doc.text(
                `TOTAL CHARGES : ${result.totalCharges.toFixed(2)}€`,
                20,
                y
            );
            y += 10;

            doc.text(
                `AVANCE VERSÉE : ${result.calculatedAdvance.toFixed(2)}€`,
                20,
                y
            );
            y += 10;

            doc.text(
                `SOLDE : ${Math.abs(result.finalBalance).toFixed(2)}€ ${
                    result.status === "to_pay"
                        ? "à payer"
                        : result.status === "to_reimburse"
                        ? "à rembourser"
                        : "équilibré"
                }`,
                20,
                y
            );
            y += 20;

            // Ajouter une nouvelle page si nécessaire
            if (y > 250) {
                doc.addPage();
                y = 20;
            }
        });

        doc.save("rapport_charges.pdf");
    };

    const onSubmit = (data: CalculationFormData) => {
        runCalculationsMutation.mutate(data);
    };

    if (areUsersLoading || areChargesLoading) {
        return (
            <div className="text-center py-10">Chargement des données...</div>
        );
    }

    return (
        <div className="container">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Calcul des charges</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-1">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            {/* Water Bill Select */}
                            <div className="space-y-2">
                                <Label htmlFor="waterBillId">
                                    Facture d'Eau
                                </Label>
                                <Controller
                                    name="waterBillId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || "none"}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner une facture d'eau" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {waterCharges?.map((charge) => (
                                                    <SelectItem
                                                        key={charge.id}
                                                        value={charge.id.toString()}
                                                    >
                                                        {`${
                                                            charge.amount
                                                        }€ (${formatDate(
                                                            charge.date
                                                        )})`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.waterBillId && (
                                    <p className="text-sm text-destructive">
                                        {errors.waterBillId.message}
                                    </p>
                                )}
                            </div>

                            {/* Insurance Bill Select */}
                            <div className="space-y-2">
                                <Label htmlFor="insuranceBillId">
                                    Facture d'Assurance
                                </Label>
                                <Controller
                                    name="insuranceBillId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || "none"}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner une facture d'assurance" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {insuranceCharges?.map(
                                                    (charge) => (
                                                        <SelectItem
                                                            key={charge.id}
                                                            value={charge.id.toString()}
                                                        >
                                                            {`${
                                                                charge.amount
                                                            }€ (${formatDate(
                                                                charge.date
                                                            )})`}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.insuranceBillId && (
                                    <p className="text-sm text-destructive">
                                        {errors.insuranceBillId.message}
                                    </p>
                                )}
                            </div>

                            {/* Bank Fees Bill Select */}
                            <div className="space-y-2">
                                <Label htmlFor="bankFeesBillId">
                                    Facture Frais Bancaires
                                </Label>
                                <Controller
                                    name="bankFeesBillId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || "none"}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner une facture de frais bancaires" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bankCharges?.map((charge) => (
                                                    <SelectItem
                                                        key={charge.id}
                                                        value={charge.id.toString()}
                                                    >
                                                        {`${
                                                            charge.amount
                                                        }€ (${formatDate(
                                                            charge.date
                                                        )})`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.bankFeesBillId && (
                                    <p className="text-sm text-destructive">
                                        {errors.bankFeesBillId.message}
                                    </p>
                                )}
                            </div>

                            {/* Number of Months for Advance Input */}
                            <div className="space-y-2">
                                <Label htmlFor="numberOfMonthsForAdvance">
                                    Nombre de mois pour l'avance sur charges
                                </Label>
                                <Controller
                                    name="numberOfMonthsForAdvance"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            step="any"
                                            placeholder="Entrez le nombre de mois"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                            error={
                                                errors.numberOfMonthsForAdvance
                                                    ?.message
                                            }
                                        />
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                disabled={runCalculationsMutation.isPending}
                            >
                                {runCalculationsMutation.isPending
                                    ? "Calcul en cours..."
                                    : "Calculer"}
                            </Button>
                            <Button variant="outline" onClick={() => reset()}>
                                Réinitialiser
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {results && results.length > 0 && (
                    <div className="md:col-span-2 space-y-8">
                        {results.map((result) => (
                            <Card key={result.user.id}>
                                <CardHeader>
                                    <CardTitle>
                                        Calculs pour {result.user.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p>
                                        <strong>Tantième :</strong>{" "}
                                        {result.user.tantieme}%
                                    </p>
                                    <p>
                                        <strong>Avance sur charges :</strong>{" "}
                                        {result.user.advanceCharges} ×{" "}
                                        {result.numberOfMonthsForAdvance} mois ={" "}
                                        {result.calculatedAdvance.toFixed(2)}€
                                    </p>
                                    <p>
                                        <strong>Consommation eau :</strong> (
                                        {result.user.waterMeterNew} -{" "}
                                        {result.user.waterMeterOld}) ×{" "}
                                        {result.waterUnitPrice.toFixed(2)} ={" "}
                                        {Math.abs(
                                            result.calculatedWaterConsumption
                                        ).toFixed(2)}
                                        €
                                    </p>
                                    <p>
                                        <strong>Assurance :</strong> (
                                        {result.totalInsuranceAmount.toFixed(2)}{" "}
                                        ÷ 100) × {result.user.tantieme} ={" "}
                                        {result.calculatedInsuranceShare.toFixed(
                                            2
                                        )}
                                        €
                                    </p>
                                    <p>
                                        <strong>Frais bancaires :</strong> (
                                        {result.totalBankFees.toFixed(2)} ÷ 100)
                                        × {result.user.tantieme} ={" "}
                                        {result.calculatedBankFeesShare.toFixed(
                                            2
                                        )}
                                        €
                                    </p>
                                    <h3 className="text-lg font-semibold mt-4">
                                        TOTAL CHARGES :{" "}
                                        {result.totalCharges.toFixed(2)}€
                                    </h3>

                                    <p
                                        className={`font-bold ${
                                            result.status === "to_pay"
                                                ? "text-red-500"
                                                : "text-green-500"
                                        }`}
                                    >
                                        <strong>SOLDE :</strong>{" "}
                                        {Math.abs(result.finalBalance).toFixed(
                                            2
                                        )}
                                        €{" "}
                                        {result.status === "to_pay"
                                            ? "à payer"
                                            : result.status === "to_reimburse"
                                            ? "à rembourser"
                                            : "équilibré"}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        onClick={() => generatePDF([result])}
                                    >
                                        Générer PDF
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
