import { useState } from "react";
import { supabase } from "../services/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>SplitMate</h1>

      <input
        style={{ width: "100%", marginBottom: 10 }}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={{ width: "100%", marginBottom: 10 }}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

      <p>
        New user?
        {" "}
        <Link to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}