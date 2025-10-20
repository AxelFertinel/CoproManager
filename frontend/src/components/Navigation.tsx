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
        <nav className="flex items-center justify-between p-4 bg-white border-b">
            <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center space-x-2">
                    <img src="/logo.png" alt="CoproManager" className="h-16" />
                </Link>
            </div>

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
                            : "text-foreground hover:bg-accent"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Accueil
                </Link>

                {user.role === "ADMIN" && (
                    <>
                        <Link
                            to="/logement"
                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                isActive("/logement")
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground hover:bg-accent"
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Logement
                        </Link>

                        <Link
                            to="/charges"
                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                isActive("/charges")
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground hover:bg-accent"
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Charges
                        </Link>
                        <Link
                            to="/calcul"
                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                isActive("/calculations")
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground hover:bg-accent"
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Calculs
                        </Link>
                    </>
                )}

                <Button variant="default" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </nav>
    );
}
