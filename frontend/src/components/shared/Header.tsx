import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="border-b tet bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold">CoproManager</span>
                </Link>
                <nav className="ml-auto flex gap-4">
                    <Link
                        to="/users"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Copropriétaires
                    </Link>
                    <Link
                        to="/charges"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Charges
                    </Link>
                    <Link
                        to="/calculations"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Calculs
                    </Link>
                </nav>
            </div>
        </header>
    );
}
