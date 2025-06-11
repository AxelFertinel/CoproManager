import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav className="border-b bg-background">
            <div className="flex h-16 items-center px-4 max-w-screen-xl mx-auto">
                <Link to="/" className="mr-8 text-xl font-bold">
                    CoproManager
                </Link>
                <div className="flex space-x-4">
                    <Link
                        to="/"
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            isActive("/")
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
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
                    >
                        Calculs
                    </Link>
                </div>
            </div>
        </nav>
    );
}
