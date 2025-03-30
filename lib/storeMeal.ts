'use server';

import { createClient } from "@/utils/supabase/server";

export async function storeMeal(userId: string, imageUrl: string) {
  const supabase = await createClient();

  const { data: meal, error: mealError } = await supabase
    .from('meals')
    .insert([
      {
        user_id: userId,
        name: 'Test Meal',
        image_url: imageUrl,
        created_at: new Date(),
      },
    ])
    .select()
    .single();

  if (mealError) {
    console.error('Error inserting meal:', mealError);
    return;
  }

  const items = [
    {
      meal_id: meal.id,
      food_name: 'Test burrito',
      calories: 994,
      total_fat: 949,
      sat_fat: 949,
      trans_fat: 499,
      cholesterol: 499,
      sodium: 949,
      total_carbohydrates: 945,
      dietary_fiber: 140,
      sugars: 245,
      protein: 140,
    },
  ];

  const { error: itemsError } = await supabase
    .from('meal_items')
    .insert(items);

  if (itemsError) {
    console.error('Error inserting items:', itemsError);
    return;
  }

  console.log('Successfully added meal and items');
}

