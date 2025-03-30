// app/actions/storeMeal.ts (or wherever you want)
'use server';

import { createClient } from "@/utils/supabase/server";

export async function fetchMeals() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    console.error('User not authenticated', userError);
    return;
  }

  const { data: meals, error } = await supabase
    .from('meals').select('*,meal_items(*)').eq('user_id',user.id).order('created_at')
  return meals ?? [];
}
