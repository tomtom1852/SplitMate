import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function Settings() {

    const { user } = useAuth();

    const [displayName, setDisplayName] =
        useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {

        const { data } =
            await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

        if (data)
            setDisplayName(
                data.display_name || ""
            );
    }

    async function saveProfile() {

        const { error } =
            await supabase
                .from("profiles")
                .update({
                    display_name:
                        displayName
                })
                .eq("id", user.id);

        if (error) {
            alert(error.message);
            return;
        }

        alert(
            "Profile Updated"
        );
    }

    return (
        <div>

            <h1>Settings</h1>

            <label>
                Display Name
            </label>

            <br />

            <input
                value={displayName}
                onChange={(e) =>
                    setDisplayName(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <button
                onClick={saveProfile}
            >
                Save
            </button>

        </div>
    );
}