"use client";

import { useEffect, useState } from "react";
import { fetchMeals } from "@/lib/fetchMeals";
import { deleteMeal } from "@/lib/deleteMeal";
import Link from "next/link";

type MealItem = {
  id: string;
  meal_id: string;
  food_name: string;
  calories: number;
  protein: number;
  total_fat: number;
  sat_fat: number;
  trans_fat: number;
  total_carbohydrates: number;
  dietary_fiber: number;
  sugars: number;
  cholesterol: number;
  sodium: number;
};

type Meal = {
  id: string;
  user_id: string;
  image_url: string;
  name: string;
  created_at: string;
  meal_items: MealItem[];
};

export default function Page() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeals = async () => {
      const data = await fetchMeals();
      setMeals(data ?? []);
      setLoading(false);
    };

    loadMeals();
  }, []);

  const handleDelete = async (mealId: string) => {
    try {
      await deleteMeal(mealId);
      setMeals((prev) => prev.filter((meal) => meal.id !== mealId));
    } catch (err) {
      console.error("Error deleting meal:", err);
    }
  };

  const handleEdit = (mealId: string) => {
    // For now this just logs or can redirect to an edit page
    console.log("Editing meal:", mealId);
    // router.push(`/edit-meal/${mealId}`);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Your Saved Meals</h1>

      {loading ? (
        <p>Loading...</p>
      ) : meals.length === 0 ? (
        <div></div>
      ) : (
        <div className="flex flex-col gap-6">
          {meals.map((meal) => {
            const nutrition = meal.meal_items?.[0]; // you can aggregate later if needed

            return (
              <div
                key={meal.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
              >
                <div className="p-6 font-sans text-black flex flex-col md:flex-row gap-6">
                  {/* Left: Meal Info */}
                  <div className="md:w-1/2 w-full flex flex-col items-center justify-center text-center">
                    {meal.image_url ? (
                      <img
                        src={meal.image_url}
                        alt={`${meal.name} image`}
                        className="w-full max-w-xs h-auto object-cover rounded mb-4"
                      />
                    ) : (
                      <div className="w-full max-w-xs h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded mb-4">
                        No Image
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-1">{meal.name}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(meal.created_at).toLocaleString()}
                    </p>
                  </div>
                  {/* Right: Nutrition Facts */}
                  <div className="md:w-1/2 w-full">
                    <div className="border-b-8 border-black pb-2 mb-2">
                      <h2 className="text-2xl font-extrabold uppercase">
                        {nutrition?.food_name ?? "—"}
                      </h2>
                    </div>

                    <div className="text-sm font-semibold mb-1">
                      Serving Size 1 meal
                    </div>
                    <div className="border-b border-black my-1" />

                    <div className="text-sm font-semibold mb-1">
                      <span className="text-lg font-bold">Calories</span>:{" "}
                      {nutrition?.calories ?? "—"}
                    </div>
                    <div className="border-b-4 border-black my-2" />

                    <ul className="text-sm space-y-1 font-medium">
                      <li>
                        <strong>Total Fat:</strong>{" "}
                        {nutrition?.total_fat ?? "—"}g
                      </li>
                      <li>
                        <em>Saturated Fat:</em> {nutrition?.sat_fat ?? "—"}g
                      </li>
                      <li>
                        <em>Trans Fat:</em> {nutrition?.trans_fat ?? "—"}g
                      </li>
                      <li>
                        <strong>Cholesterol:</strong>{" "}
                        {nutrition?.cholesterol ?? "—"}mg
                      </li>
                      <li>
                        <strong>Sodium:</strong> {nutrition?.sodium ?? "—"}
                        mg
                      </li>
                      <li>
                        <strong>Total Carbohydrate:</strong>{" "}
                        {nutrition?.total_carbohydrates ?? "—"}g
                      </li>
                      <li>
                        <em>Dietary Fiber:</em>{" "}
                        {nutrition?.dietary_fiber ?? "—"}g
                      </li>
                      <li>
                        <em>Sugars:</em> {nutrition?.sugars ?? "—"}g
                      </li>
                      <li>
                        <strong>Protein:</strong> {nutrition?.protein ?? "—"}g
                      </li>
                    </ul>
                    <div className="flex gap-4 mt-6">
                      <Link href={`/protected/edit-meal/${meal.id}`}>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(meal.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
