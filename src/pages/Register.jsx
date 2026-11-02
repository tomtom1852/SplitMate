import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function register() {

        const { data, error } =
            await supabase.auth.signUp({
                email,
                password
            });

        if (error) {
            alert(error.message);
            return;
        }

        
        alert("Account created successfully. Please login.");
    }

    return (
        <div style={{ maxWidth: 400, margin: "50px auto" }}>

            <h1>Register</h1>

            <input
                style={{ width: "100%", marginBottom: 10 }}
                placeholder="Name"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

            <input
                style={{ width: "100%", marginBottom: 10 }}
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <input
                style={{ width: "100%", marginBottom: 10 }}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <button onClick={register}>
                Create Account
            </button>

            <p>
                Already have an account?
                {" "}
                <Link to="/login">
                    Login
                </Link>
            </p>

        </div>
    );
}