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
import { Label } from "@radix-ui/react-label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/Select";
import { api, Charge, ChargeType } from "../../services/api";
import { useState, useEffect } from "react";
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
    logement: {
        id: number;
        name: string;
        tantieme: number;
        advanceCharges: number;
        waterMeterOld: number;
        waterMeterNew: number;
        email: string;
        coproprieteId: string;
    };
    totalMonth: number;
    totalWaterBill: number;
    waterUnitPrice: number;
    totalInsuranceAmount: number;
    totalBankFees: number;
    calculatedAdvance: number;
    calculatedWaterConsumption: number;
    calculatedInsuranceShare: number;
    calculatedBankFeesShare: number;
    totalCharges: number;
    finalBalance: number;
    status: "to_pay" | "to_reimburse" | "balanced";
}

const calculationSchema = z.object({
    startDate: z.string().nonempty("La date de début est requise"),
    endDate: z.string().nonempty("La date de fin est requise"),
});

type CalculationFormData = z.infer<typeof calculationSchema>;

export default function CalculationsPage() {
    const [results, setResults] = useState<CalculationResult[] | null>(null);
    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<CalculationFormData>({
        resolver: zodResolver(calculationSchema),
    });

    const runCalculationsMutation = useMutation({
        mutationFn: (data: CalculationFormData) => {
            return api
                .post<CalculationResult[]>("/calculations/test", {
                    startDate: data.startDate,
                    endDate: data.endDate,
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
            doc.text(
                `COPROPRIÉTAIRE ${result.logement.name}`,
                pageWidth / 2,
                y,
                {
                    align: "center",
                }
            );
            y += 10;

            // Détails
            doc.setFontSize(12);
            doc.text(`Tantième : ${result.logement.tantieme}%`, 20, y);
            y += 10;

            doc.text(
                `Avance sur charges : ${result.logement.advanceCharges} × ${
                    result.totalMonth
                } mois = ${result.calculatedAdvance.toFixed(2)}€`,
                20,
                y
            );
            y += 10;

            doc.text(
                `Consommation eau : (${result.logement.waterMeterNew} - ${
                    result.logement.waterMeterOld
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
                    result.logement.tantieme
                } = ${result.calculatedInsuranceShare.toFixed(2)}€`,
                20,
                y
            );
            y += 10;

            doc.text(
                `Frais bancaires : (${result.totalBankFees.toFixed(
                    2
                )} ÷ 100) × ${
                    result.logement.tantieme
                } = ${result.calculatedBankFeesShare.toFixed(2)}€`,
                20,
                y
            );
            y += 10;

            doc.text(
                `Total charges : ${result.totalCharges.toFixed(2)}€`,
                20,
                y
            );
            y += 10;

            doc.text(
                `Avance versée : ${result.calculatedAdvance.toFixed(2)}€`,
                20,
                y
            );
            y += 10;

            doc.text(
                `Avance - charges : ${result.calculatedAdvance.toFixed(
                    2
                )} - ${result.totalCharges.toFixed(
                    2
                )} = ${result.finalBalance.toFixed(2)}€`,
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
            doc.save(`calculs_charges_${result.logement.name}.pdf`);
        });
    };

    const onSubmit = (data: CalculationFormData) => {
        runCalculationsMutation.mutate(data);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Calcul des charges</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <form
                        className="rounded-lg border bg-card text-card-foreground shadow-sm md:col-span-1"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <CardContent className="space-y-4">
                            {/* <div className="space-y-2">
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
                            </div> */}

                            {/* Number of Months for Advance Input */}
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Mois du début</Label>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="date"
                                            step="any"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            {/* Number of Months for Advance Input */}
                            <div className="space-y-2">
                                <Label htmlFor="endDate">Mois du fin</Label>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="date"
                                            step="any"
                                            {...field}
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
                </div>

                {results && results.length > 0 && (
                    <div className="md:col-span-2 space-y-8">
                        {results.map((result) => (
                            <Card key={result.logement.id}>
                                <CardHeader>
                                    <CardTitle>
                                        {result.logement.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p>
                                        <strong>Tantième :</strong>{" "}
                                        {result.logement.tantieme}%
                                    </p>
                                    <p>
                                        <strong>Avance sur charges :</strong>{" "}
                                        {result.logement.advanceCharges} ×{" "}
                                        {result.totalMonth} mois ={" "}
                                        {result.calculatedAdvance.toFixed(2)}€
                                    </p>
                                    <p>
                                        <strong>Consommation eau :</strong> (
                                        {result.logement.waterMeterNew} -{" "}
                                        {result.logement.waterMeterOld}) ×{" "}
                                        {result.waterUnitPrice.toFixed(2)} ={" "}
                                        {Math.abs(
                                            result.calculatedWaterConsumption
                                        ).toFixed(2)}
                                        €
                                    </p>
                                    <p>
                                        <strong>Assurance :</strong> (
                                        {result.totalInsuranceAmount.toFixed(2)}{" "}
                                        ÷ 100) × {result.logement.tantieme} ={" "}
                                        {result.calculatedInsuranceShare.toFixed(
                                            2
                                        )}
                                        €
                                    </p>
                                    <p>
                                        <strong>Frais bancaires :</strong> (
                                        {result.totalBankFees.toFixed(2)} ÷ 100)
                                        × {result.logement.tantieme} ={" "}
                                        {result.calculatedBankFeesShare.toFixed(
                                            2
                                        )}
                                        €
                                    </p>
                                    <p>
                                        <strong>Avance - charges :</strong>{" "}
                                        {result.calculatedAdvance} -{" "}
                                        {result.totalCharges} ={" "}
                                        {result.finalBalance}€
                                    </p>

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
