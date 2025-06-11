import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import HomePage from "./features/home/HomePage";
import UserListPage from "./features/users/UserListPage";
import UserFormPage from "./features/users/UserFormPage";
import ChargesPage from "./features/charges/ChargesPage";
import ChargeFormPage from "./features/charges/ChargeFormPage";
import CalculationsPage from "./features/calculations/CalculationsPage";
import { authService } from "./services/auth.service";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());

    useEffect(() => {
        const handleLoginStatusChange = () => {
            setIsLoggedIn(authService.isLoggedIn());
        };

        authService.onAuthStatusChange(handleLoginStatusChange);

        // Nettoyage de l'écouteur d'événements lors du démontage du composant
        return () => {
            authService.offAuthStatusChange(handleLoginStatusChange);
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="min-h-screen bg-background">
                    {isLoggedIn && <Navigation />}
                    <main className="p-4 container">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/register"
                                element={<RegisterPage />}
                            />

                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <HomePage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/copropriete"
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]}>
                                        <UserListPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/copropriete/new"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={["admin", "basic"]}
                                    >
                                        <UserFormPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/copropriete/:id"
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]}>
                                        <UserFormPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/charges"
                                element={
                                    <ProtectedRoute>
                                        <ChargesPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/charges/new"
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]}>
                                        <ChargeFormPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/charges/:id"
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]}>
                                        <ChargeFormPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/calculations"
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]}>
                                        <CalculationsPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="*"
                                element={<Navigate to="/" replace />}
                            />
                        </Routes>
                    </main>
                    <ToastContainer position="top-right" autoClose={3000} />
                </div>
            </Router>
        </QueryClientProvider>
    );
}
