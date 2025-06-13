import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Receipt, Calculator } from "lucide-react";

export default function HomePage() {
    const navigate = useNavigate();

    const steps = [
        {
            title: "Gérer les Copropriétaires",
            description:
                "Ajoutez et gérez les copropriétaires de votre immeuble. Définissez leurs tantièmes et leurs avances sur charges.",
            icon: <Users className="h-8 w-8" />,
            path: "/logement",
            buttonText: "Gérer les copropriétaires",
        },
        {
            title: "Gérer les Charges",
            description:
                "Enregistrez les factures d'eau, d'assurance et les frais bancaires. Ajoutez des descriptions pour un meilleur suivi.",
            icon: <Receipt className="h-8 w-8" />,
            path: "/charges",
            buttonText: "Gérer les charges",
        },
        {
            title: "Calculer les Charges",
            description:
                "Sélectionnez les factures et calculez automatiquement les charges pour chaque copropriétaire. Générez un PDF des résultats.",
            icon: <Calculator className="h-8 w-8" />,
            path: "/calculations",
            buttonText: "Calculer les charges",
        },
    ];

    return (
        <div>
            <div className="mb-5">
                <h1 className="text-2xl font-bold">
                    Bienvenue dans votre Gestionnaire de Copropriété
                </h1>
                <p className="text-muted-foreground">
                    Cette application vous permet de gérer facilement les
                    charges de votre copropriété. Suivez les étapes ci-dessous
                    pour commencer.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step, index) => (
                    <Card key={index} className="relative flex flex-col h-full">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    {step.icon}
                                </div>
                                <div>
                                    <CardTitle className="text-lg">
                                        {step.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {step.description}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow"></CardContent>
                        <CardFooter>
                            <Button
                                onClick={() => navigate(step.path)}
                                className="w-full"
                            >
                                {step.buttonText}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
