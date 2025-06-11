import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 max-w-screen-xl mx-auto">
                <Link to="/" className="text-xl font-bold text-primary">
                    CoproManager
                </Link>

                {/* Menu Burger pour mobile */}
                <button
                    className="md:hidden p-2 bg-primary rounded-md hover:bg-primary/90 transition-colors"
                    onClick={toggleMenu}
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
                    <Link
                        to="/users"
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            isActive("/users")
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
                </div>
            </div>
        </nav>
    );
}
