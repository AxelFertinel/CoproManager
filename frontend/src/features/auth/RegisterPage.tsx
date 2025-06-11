import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { RegisterData, UserRole } from "../../types/auth";
import { authService } from "../../services/auth.service";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "../../components/ui/Card";
import { Label } from "../../components/ui/Label";

interface RegisterFormData {
    email: string;
    password: string;
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>();

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const registerData: RegisterData = {
                ...data,
                role: "admin" as UserRole,
                coproprieteId: Math.floor(Math.random() * 1000000),
            };
            await authService.register(registerData);
            toast.success("Compte créé avec succès");
            navigate("/"); // Rediriger vers la page d'accueil après l'inscription
        } catch (error) {
            toast.error("Erreur lors de la création du compte");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Créer un compte administrateur
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "L'email est requis",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email invalide",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password", {
                                    required: "Le mot de passe est requis",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Le mot de passe doit contenir au moins 6 caractères",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Création..." : "Créer un compte"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Déjà un compte ?{" "}
                        <Link
                            to="/login"
                            className="text-primary hover:underline"
                        >
                            Se connecter
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
