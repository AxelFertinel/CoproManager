import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
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

import { api } from "../../services/api";
import { useState } from "react";

import jsPDF from "jspdf";

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
    calculatedOtherCharges: number;
    totalOtherCharges: number;
    totalCharges: number;
    finalBalance: number;
    status: "to_pay" | "to_reimburse" | "balanced";
}

const calculationSchema = z
    .object({
        startDate: z.string().min(1, "La date de début est requise"),
        endDate: z.string().min(1, "La date de fin est requise"),
    })
    .refine(
        (data) => {
            if (data.startDate && data.endDate) {
                return new Date(data.startDate) <= new Date(data.endDate);
            }
            return true;
        },
        {
            message: "La date de fin doit être postérieure à la date de début",
            path: ["endDate"],
        }
    );
type CalculationFormData = z.infer<typeof calculationSchema>;

export default function CalculationsPage() {
    const [results, setResults] = useState<CalculationResult[] | null>(null);
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<CalculationFormData>({
        resolver: zodResolver(calculationSchema),
        defaultValues: {
            startDate: "",
            endDate: "",
        },
    });

    const calculChargesMutation = useMutation({
        mutationFn: (data: CalculationFormData) => {
            return api
                .post<CalculationResult[]>("/calculations", {
                    startDate: data.startDate,
                    endDate: data.endDate,
                })
                .then((res) => res.data);
        },
        onSuccess: (data) => {
            setResults(data);
            console.log("🇬🇳 data:", data);
            if (data.length === 0) {
                toast.error(
                    "Aucun résultat de calcul trouvé pour la période donnée."
                );
                return;
            } else {
                toast.success("Calculs effectués avec succès.");
            }
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

            {
                result.totalInsuranceAmount > 0 &&
                    doc.text(
                        `Assurance : (${result.totalInsuranceAmount.toFixed(
                            2
                        )} ÷ 100) × ${
                            result.logement.tantieme
                        } = ${result.totalInsuranceAmount.toFixed(2)}€`,
                        20,
                        y
                    );
                result.totalInsuranceAmount > 0 && (y += 10);
            }

            {
                result.totalBankFees > 0 &&
                    doc.text(
                        `Frais bancaires : (${result.totalBankFees.toFixed(
                            2
                        )} ÷ 100) × ${
                            result.logement.tantieme
                        } = ${result.calculatedBankFeesShare.toFixed(2)}€`,
                        20,
                        y
                    );
                result.totalBankFees > 0 && (y += 10);
            }
            {
                result.totalOtherCharges > 0 &&
                    doc.text(
                        `Autre frais : (${result.totalOtherCharges.toFixed(
                            2
                        )} ÷ 100) × ${
                            result.logement.tantieme
                        } = ${result.calculatedOtherCharges.toFixed(2)}€`,
                        20,
                        y
                    );
                result.totalOtherCharges > 0 && (y += 10);
            }

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
        calculChargesMutation.mutate(data);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Calcul des charges</h1>
                    <p className="text-muted-foreground">
                        Effectuez les calculs des charges pour la copropriété en
                        quelques clics
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <form
                        className="rounded-lg border bg-card text-card-foreground shadow-sm md:col-span-1"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <CardContent className="space-y-4">
                            {/* Number of Months for Advance Input */}
                            <div className="space-y-2">
                                <Label htmlFor="startDate">
                                    Choisir le mois du début de votre exercice
                                </Label>
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
                                {errors.startDate && (
                                    <p className="text-red-500 text-sm">
                                        {errors.startDate.message}
                                    </p>
                                )}
                            </div>
                            {/* Number of Months for Advance Input */}
                            <div className="space-y-2">
                                <Label htmlFor="endDate">
                                    Choisir le mois de fin de votre exercice
                                </Label>
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
                                {errors.endDate && (
                                    <p className="text-red-500 text-sm">
                                        {errors.endDate.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                disabled={calculChargesMutation.isPending}
                            >
                                {calculChargesMutation.isPending
                                    ? "Calcul en cours..."
                                    : "Calculer"}
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
                                        <strong>Tantième :</strong>&nbsp;
                                        {result.logement.tantieme}%
                                    </p>
                                    <p>
                                        <strong>Avance sur charges :</strong>
                                        &nbsp;
                                        {result.logement.advanceCharges} ×&nbsp;
                                        {result.totalMonth} mois =&nbsp;
                                        {result.calculatedAdvance.toFixed(2)}€
                                    </p>

                                    {result.totalInsuranceAmount > 0 && (
                                        <p>
                                            <strong>Assurance :</strong>&nbsp; (
                                            {result.totalInsuranceAmount.toFixed(
                                                2
                                            )}
                                            ÷ 100) × {result.logement.tantieme}
                                            =&nbsp;
                                            {result.calculatedInsuranceShare.toFixed(
                                                2
                                            )}
                                            €
                                        </p>
                                    )}

                                    {result.calculatedWaterConsumption > 0 && (
                                        <p>
                                            <strong>Consommation eau :</strong>
                                            &nbsp; (
                                            {result.logement.waterMeterNew}-
                                            {result.logement.waterMeterOld})
                                            ×&nbsp;
                                            {result.waterUnitPrice.toFixed(2)}
                                            =&nbsp;
                                            {Math.abs(
                                                result.calculatedWaterConsumption
                                            ).toFixed(2)}
                                            €
                                        </p>
                                    )}

                                    {result.totalBankFees > 0 && (
                                        <p>
                                            <strong>Frais bancaires :</strong>
                                            &nbsp; (
                                            {result.totalBankFees.toFixed(2)} ÷
                                            100) ×&nbsp;{" "}
                                            {result.logement.tantieme}
                                            =&nbsp;
                                            {result.calculatedBankFeesShare.toFixed(
                                                2
                                            )}
                                            €
                                        </p>
                                    )}
                                    {result.totalOtherCharges > 0 && (
                                        <p>
                                            <strong>Autre frais :</strong>&nbsp;
                                            (
                                            {result.totalOtherCharges.toFixed(
                                                2
                                            )}
                                            ÷ 100) ×&nbsp;{" "}
                                            {result.logement.tantieme}
                                            =&nbsp;
                                            {result.calculatedOtherCharges.toFixed(
                                                2
                                            )}
                                            €
                                        </p>
                                    )}
                                    <p>
                                        <strong>Avance - charges :</strong>
                                        &nbsp;
                                        {result.calculatedAdvance} -
                                        {result.totalCharges} =&nbsp;
                                        {result.finalBalance}€
                                    </p>

                                    <p
                                        className={`font-bold ${
                                            result.status === "to_pay"
                                                ? "text-red-500"
                                                : "text-green-500"
                                        }`}
                                    >
                                        <strong>SOLDE :</strong>&nbsp;
                                        {Math.abs(result.finalBalance).toFixed(
                                            2
                                        )}
                                        €
                                        {result.status === "to_pay"
                                            ? " à payer"
                                            : result.status === "to_reimburse"
                                            ? " à rembourser"
                                            : " équilibré"}
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
