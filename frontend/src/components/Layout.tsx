import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

export default function Layout() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="mx-auto py-6 max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}
