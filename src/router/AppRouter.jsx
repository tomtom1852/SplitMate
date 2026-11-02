import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import Expenses from "../pages/Expenses";
import Transactions from "../pages/Transactions";
import MonthlySummary from "../pages/MonthlySummary";
import Settlement from "../pages/Settlement";
import EditExpense from "../pages/EditExpense";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Settings />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/expenses"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Expenses />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-expense/:id"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <EditExpense />
                            </Layout>
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Transactions />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settlement"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Settlement />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/summary"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <MonthlySummary />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}