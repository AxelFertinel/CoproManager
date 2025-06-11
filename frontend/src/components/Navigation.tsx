import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { authService } from "../services/auth.service";
import { toast } from "react-toastify";
import { Button } from "./ui/Button";
import { User } from "../types/auth";

export default function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setUser(authService.getCurrentUser());
    }, []);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            toast.success("Déconnexion réussie");
            navigate("/login");
        } catch (error) {
            toast.error("Erreur lors de la déconnexion");
        }
    };

    if (!user) {
        return null;
    }

    return (
        <nav className="border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 max-w-screen-xl mx-auto">
                <Link to="/" className="text-xl font-bold text-primary">
                    CoproManager
                </Link>

                {/* Menu Burger pour mobile */}
                <button
                    className="md:hidden p-2 bg-primary rounded-md hover:bg-primary/90 transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6 text-black" />
                    ) : (
                        <Menu className="h-6 w-6 text-black" />
                    )}
                </button>

                {/* Menu de navigation */}
                <div
                    className={`${
                        isMenuOpen ? "flex" : "hidden"
                    } md:flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 right-0 bg-background md:bg-transparent border-b md:border-0 p-4 md:p-0 space-y-4 md:space-y-0 md:space-x-4 shadow-lg md:shadow-none`}
                >
                    <Link
                        to="/"
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            isActive("/")
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Accueil
                    </Link>

                    {user.role === "admin" && (
                        <>
                            <Link
                                to="/copropriete"
                                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive("/copropriete")
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Copropriétaires
                            </Link>
                            <Link
                                to="/charges"
                                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive("/charges")
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Charges
                            </Link>
                            <Link
                                to="/calculations"
                                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive("/calculations")
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Calculs
                            </Link>
                        </>
                    )}

                    <span className="text-primary-foreground">
                        Bienvenue, {user.name || user.email}!
                    </span>

                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                    </Button>
                </div>
            </div>
        </nav>
    );
}
