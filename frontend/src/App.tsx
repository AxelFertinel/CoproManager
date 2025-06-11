import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UsersListPage from "./features/users/UsersListPage";
import UserFormPage from "./features/users/UserFormPage";
import ChargesPage from "./features/charges/ChargesPage";
import ChargeFormPage from "./features/charges/ChargeFormPage";
import CalculationsPage from "./features/calculations/CalculationsPage";
import HomePage from "./features/home/HomePage";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="users" element={<UsersListPage />} />
                        <Route path="users/new" element={<UserFormPage />} />
                        <Route
                            path="users/:id/edit"
                            element={<UserFormPage />}
                        />
                        <Route path="charges" element={<ChargesPage />} />
                        <Route
                            path="charges/new"
                            element={<ChargeFormPage />}
                        />
                        <Route
                            path="charges/:id/edit"
                            element={<ChargeFormPage />}
                        />
                        <Route
                            path="calculations"
                            element={<CalculationsPage />}
                        />
                    </Route>
                </Routes>
            </Router>
            <ToastContainer position="bottom-right" autoClose={3000} />
        </QueryClientProvider>
    );
}

export default App;
