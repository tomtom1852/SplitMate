import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createHousehold }
    from "../services/householdService";

import JoinHousehold
    from "./JoinHousehold";

export default function HouseholdSetup() {

    const { user } = useAuth();

    const [name, setName] =
        useState("");

    const [mode, setMode] =
        useState("create");

    async function handleCreate() {

        const household =
            await createHousehold(
                user.id,
                name
            );

        alert(
            `Invite Code: ${household.invite_code}`
        );

        window.location.reload();
    }

    if (mode === "join")
        return <JoinHousehold />;

    return (
        <div>

            <h1>
                Household Setup
            </h1>

            <button
                onClick={() =>
                    setMode("create")
                }
            >
                Create
            </button>

            <button
                onClick={() =>
                    setMode("join")
                }
            >
                Join
            </button>

            <br />
            <br />

            <input
                value={name}
                onChange={(e) =>
                    setName(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <button
                onClick={
                    handleCreate
                }
            >
                Create Household
            </button>

        </div>
    );
}