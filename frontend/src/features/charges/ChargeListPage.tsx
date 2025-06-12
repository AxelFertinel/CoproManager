import { useQuery } from "@tanstack/react-query";
import { chargesService } from "../../services/charges";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

export function ChargeListPage() {
    const { data: charges, isLoading } = useQuery({
        queryKey: ["charges"],
        queryFn: () => chargesService.getAll(),
    });

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Charges</h1>
                <Button asChild>
                    <Link to="/charges/new">Nouvelle charge</Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {charges?.map((charge) => (
                        <TableRow key={charge.id}>
                            <TableCell>
                                {new Date(charge.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{charge.type}</TableCell>
                            <TableCell>{charge.amount.toFixed(2)} €</TableCell>
                            <TableCell>{charge.description}</TableCell>
                            <TableCell>
                                <Button variant="outline" asChild>
                                    <Link to={`/charges/${charge.id}`}>
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
