import { useQuery } from "@tanstack/react-query";
import { calculationsService } from "../../services/calculations";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date";

export function CalculationListPage() {
    const { data: calculations, isLoading } = useQuery({
        queryKey: ["calculations"],
        queryFn: () => calculationsService.getAll(),
    });

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Calculs</h1>
                <Button>
                    <Link to="/calculations/new">Nouveau calcul</Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant eau</TableHead>
                        <TableHead>Montant assurance</TableHead>
                        <TableHead>Montant banque</TableHead>
                        <TableHead>Avance charges</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {calculations?.map((calculation) => (
                        <TableRow key={calculation.id}>
                            <TableCell>
                                {new Date(
                                    calculation.date
                                ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                {formatDate(calculation.date)}
                            </TableCell>
                            <TableCell>
                                {calculation.waterAmount.toFixed(2)} €
                            </TableCell>
                            <TableCell>
                                {calculation.insuranceAmount.toFixed(2)} €
                            </TableCell>
                            <TableCell>
                                {calculation.bankAmount.toFixed(2)} €
                            </TableCell>
                            <TableCell>
                                {calculation.advanceCharges.toFixed(2)} €
                            </TableCell>
                            <TableCell>
                                {calculation.totalAmount.toFixed(2)} €
                            </TableCell>
                            <TableCell>
                                <Button variant="outline">
                                    <Link
                                        to={`/calculations/${calculation.id}`}
                                    >
                                        Modifier
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
