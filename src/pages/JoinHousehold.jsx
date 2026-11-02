import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

export default function JoinHousehold() {

    const { user } = useAuth();

    const [inviteCode, setInviteCode] =
        useState("");

    async function joinHousehold() {

        const { data: household } =
            await supabase
                .from("households")
                .select("*")
                .eq("invite_code", inviteCode)
                .single();

        if (!household) {

            alert("Invalid invite code");

            return;

        }

        await supabase
            .from("profiles")
            .update({
                household_id:
                    household.id
            })
            .eq("id", user.id);

        await supabase
            .from("household_members")
            .insert({
                household_id:
                    household.id,

                profile_id:
                    user.id,

                role:
                    "member"
            });

        alert("Joined successfully");

        window.location.reload();
    }

    return (
        <div>

            <h1>
                Join Household
            </h1>

            <input
                value={inviteCode}
                onChange={(e) =>
                    setInviteCode(
                        e.target.value
                    )
                }
                placeholder="Invite Code"
            />

            <br />
            <br />

            <button
                onClick={joinHousehold}
            >
                Join
            </button>

        </div>
    );
}