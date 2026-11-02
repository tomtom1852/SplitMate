import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";
import HouseholdSetup from "./HouseholdSetup";

export default function Dashboard() {

    const { user } = useAuth();

    const [profile, setProfile] =
        useState(null);

    const [household, setHousehold] =
        useState(null);

    const [memberCount, setMemberCount] =
        useState(0);

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    async function loadProfile() {

        const { data: profileData } =
            await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

        setProfile(profileData);

        if (
            profileData?.household_id
        ) {

            const {
                data: householdData
            } =
                await supabase
                    .from("households")
                    .select("*")
                    .eq(
                        "id",
                        profileData.household_id
                    )
                    .single();

            setHousehold(
                householdData
            );

            const {
                count
            } =
                await supabase
                    .from("profiles")
                    .select("*", {
                        count: "exact",
                        head: true
                    })
                    .eq(
                        "household_id",
                        profileData.household_id
                    );

            setMemberCount(
                count || 0
            );
        }
    }

    if (!profile) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    if (!profile.household_id) {
        return (
            <HouseholdSetup />
        );
    }

    return (
        <div style={{ padding: 20 }}>

            <h1>
                SplitMate Dashboard
            </h1>

            <p>
                Welcome,{" "}
                <strong>
                    {profile.display_name}
                </strong>
            </p>

            <p>
                Email:{" "}
                {user.email}
            </p>

            <hr />

            <h2>
                Household Information
            </h2>

            <p>
                <strong>
                    Household:
                </strong>{" "}
                {
                    household?.name ||
                    "Unknown Household"
                }{" "}
                ✅
            </p>

            <p>
                <strong>
                    Invite Code:
                </strong>{" "}
                {
                    household?.invite_code ||
                    "N/A"
                }
            </p>

            <p>
                <strong>
                    Members:
                </strong>{" "}
                {memberCount}
            </p>

        </div>
    );
}