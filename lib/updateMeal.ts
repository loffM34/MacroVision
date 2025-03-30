// app/actions/updateMeal.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateMeal(mealId: string, newData: {
  name?: string;
  image_url?: string;
  food_name?: string;
  calories?: number;
  total_fat?: number;
  sat_fat?: number;
  trans_fat?: number;
  cholesterol?: number;
  sodium?: number;
  total_carbohydrates?: number;
  dietary_fiber?: number;
  sugars?: number;
  protein?: number;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('meals')
    .update(newData)
    .eq('id', mealId);

  if (error) {
    console.error('Update failed:', error.message);
    throw new Error(error.message);
  }

  return { success: true };
}
