// app/(protected)/edit-meal/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { updateMeal } from "@/lib/updateMeal";
import { createBrowserClient } from "@supabase/ssr";

export default function Page() {
  const { id: mealId } = useParams();
  const router = useRouter();

  const [mealName, setMealName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from("meals")
        .select("name")
        .eq("id", mealId)
        .single();

      if (data) setMealName(data.name);
      setLoading(false);
    };

    fetchMeal();
  }, [mealId]);

  const handleSubmit = async () => {
    await updateMeal(mealId as string, { name: mealName });
    router.push("/protected/user-page"); // return to meals list
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Edit Meal</h1>
      <input
        className="w-full p-2 border rounded"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
      />
      
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
}
