import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Layout({ children }) {

    async function handleLogout() {
        await supabase.auth.signOut();
        window.location.href = "/login";
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>

            <aside
                style={{
                    width: "220px",
                    background: "#f4f4f4",
                    padding: "20px",
                }}
            >
                <h2>SplitMate</h2>

                <nav
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <Link to="/">Dashboard</Link>

                    <Link to="/expenses">
                        Expenses
                    </Link>

                    <Link to="/transactions">
                        Transactions
                    </Link>
                    <Link to="/settlement">Settlement</Link>
                    <Link to="/summary">
                        Monthly Summary
                    </Link>

                    <Link to="/settings">
                        Settings
                    </Link>

                    <button onClick={handleLogout}>
                        Logout
                    </button>

                </nav>
            </aside>

            <main
                style={{
                    flex: 1,
                    padding: "30px",
                }}
            >
                {children}
            </main>

        </div>
    );
}