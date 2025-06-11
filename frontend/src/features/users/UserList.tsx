import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardDescription,
    CardTitle,
    CardFooter,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { User, getUsers, deleteUser } from "../../services/api"; // Utilisation de l'interface User du service API
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers(); // Utilisation de la fonction getUsers du service API
            setUsers(data);
            setError(null);
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors du chargement des utilisateurs");
            setError("Erreur lors du chargement des utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
            )
        ) {
            try {
                await deleteUser(id); // Utilisation de la fonction deleteUser du service API
                setUsers(users.filter((user) => user.id !== id));
                toast.success("Utilisateur supprimé avec succès");
            } catch (err) {
                console.error(err);
                toast.error("Erreur lors de la suppression de l'utilisateur");
                setError("Erreur lors de la suppression de l'utilisateur");
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10">
                Chargement des utilisateurs...
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Copropriétaires
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez les copropriétaires de votre immeuble
                    </p>
                </div>
                <Link to="/users/new">
                    <Button>Ajouter un copropriétaire</Button>
                </Link>
            </div>

            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {users.length > 0 ? (
                    users.map((user) => (
                        <Card
                            key={user.id}
                            className="h-full flex flex-col justify-between"
                        >
                            <CardHeader>
                                <CardTitle>{user.name}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <dl className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Tantième
                                        </dt>
                                        <dd>{user.tantieme}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Avance
                                        </dt>
                                        <dd>{user.advanceCharges}€</dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Compteur d'eau
                                        </dt>
                                        <dd>
                                            {user.waterMeterOld} →{" "}
                                            {user.waterMeterNew}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Dernière mise à jour
                                        </dt>
                                        <dd>
                                            {new Date(
                                                user.updatedAt
                                            ).toLocaleDateString("fr-FR")}
                                        </dd>
                                    </div>
                                </dl>
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2">
                                <Link to={`/users/${user.id}`}>
                                    <Button variant="outline">Modifier</Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Supprimer
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p>Aucun utilisateur trouvé.</p>
                )}
            </div>
        </div>
    );
}
