'use server';

import { createClient } from "@/utils/supabase/server";

export async function deleteMeal(mealId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("meals")
    .delete()
    .eq("id", mealId);

  if (error) {
    console.error("Failed to delete meal:", error.message);
    throw new Error(error.message);
  }

  return { success: true };
}
