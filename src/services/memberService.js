import { supabase } from "./supabase";

export async function getHouseholdMembers(
    householdId
) {
    const { data, error } =
        await supabase
            .from("household_members")
            .select(`
        role,
        profiles (
          id,
          display_name,
          email
        )
      `)
            .eq(
                "household_id",
                householdId
            );

    if (error) throw error;

    return data;
}