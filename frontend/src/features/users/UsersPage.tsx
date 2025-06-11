import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { usersService } from "../../services/users";

export default function UsersPage() {
    const navigate = useNavigate();
    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: usersService.getAll,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Copropriétaires
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez les copropriétaires et leurs informations
                    </p>
                </div>
                <Button onClick={() => navigate("/users/new")}>
                    Ajouter un copropriétaire
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users?.map((user) => (
                    <Card
                        key={user.id}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {user.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        navigate(`/users/${user.id}/edit`)
                                    }
                                >
                                    Modifier
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        Tantième
                                    </span>
                                    <span className="font-medium">
                                        {user.tantieme}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        Avance sur charges
                                    </span>
                                    <span className="font-medium">
                                        {user.advanceCharges}€/mois
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        Compteur d'eau
                                    </span>
                                    <span className="font-medium">
                                        {user.waterMeterOld} →{" "}
                                        {user.waterMeterNew} m³
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
