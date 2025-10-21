import { useQuery } from "@tanstack/react-query";
import { chargesService } from "../../services/charges";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import ChargeList from "./ChargeList";

export function ChargeListPage() {
    const { data: charges, isLoading } = useQuery({
        queryKey: ["charges"],
        queryFn: () => chargesService.getAll(),
    });

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Charges</h1>
                    <p className="text-muted-foreground">
                        Gérez les chages de votre copropriété.
                    </p>
                </div>
                <Link to="/charges/new">
                    <Button>Ajouter une charge</Button>
                </Link>
            </div>

            {charges && <ChargeList charges={charges} />}
        </div>
    );
}
