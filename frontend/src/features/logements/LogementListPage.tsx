import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import LogementList from "./LogementList";
import { logementsService } from "../../services/logements";

export default function LogementListPage() {
    const navigate = useNavigate();
    const { data: logements = [], isLoading } = useQuery({
        queryKey: ["logements"],
        queryFn: logementsService.getAll,
    });

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Logements
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez les logements de votre immeuble.
                    </p>
                </div>
                <Link to="/logement/new">
                    <Button>Ajouter un logement</Button>
                </Link>
            </div>
            <LogementList logements={logements} />
        </div>
    );
}
