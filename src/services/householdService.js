import { supabase } from "./supabase";

export async function createHousehold(
    userId,
    householdName
) {
    const inviteCode =
        Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase();

    const { data, error } =
        await supabase
            .from("households")
            .insert({
                name: householdName,
                invite_code: inviteCode
            })
            .select()
            .single();

    if (error) throw error;

    await supabase
        .from("profiles")
        .update({
            household_id: data.id
        })
        .eq("id", userId);

    await supabase
        .from("household_members")
        .insert({
            household_id: data.id,
            profile_id: userId,
            role: "owner"
        });

    return data;
}