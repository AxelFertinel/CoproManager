import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

export default function Layout() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="mx-auto py-3 container ">
                <Outlet />
            </main>
        </div>
    );
}
