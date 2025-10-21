import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LogementListPage from "./pages/logements/LogementListPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChargeFormPage from "./pages/charges/ChargeFormPage";
import { ChargeListPage } from "./pages/charges/ChargeListPage";
import CalculationsPage from "./pages/calculations/CalculationsPage";
import HomePage from "./pages/home/HomePage";
import LogementFormPage from "./pages/logements/LogementFormPage";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<HomePage />} />
                        <Route
                            path="/logement"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN"]}>
                                    <LogementListPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/logement/new"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN"]}>
                                    <LogementFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/logement/:id"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN"]}>
                                    <LogementFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/logement/:id/edit"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN"]}>
                                    <LogementFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/charges"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN"]}>
                                    <ChargeListPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/charges/new"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN"]}>
                                    <ChargeFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/charges/:id"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN"]}>
                                    <ChargeFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/charges/:id/edit"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN"]}>
                                    <ChargeFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/calcul"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN"]}>
                                    <CalculationsPage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Routes>
                <ToastContainer position="bottom-right" autoClose={3000} />
            </Router>
        </QueryClientProvider>
    );
}

export default App;
