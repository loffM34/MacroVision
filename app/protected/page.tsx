"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card/card";
import { CardContent } from "@/components/ui/card/cardcontent";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { uploadMealImage } from "@/lib/uploadMealImage";
import { storeMeal } from "@/lib/storeMeal";
import { useRouter } from "next/navigation";
import { Link } from "lucide-react";
import NutritionSearch from "@/components/NutritionSearch";

export default function Page() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<{
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      setNutritionData({
        calories: 520,
        protein: "24g",
        carbs: "58g",
        fat: "22g",
        fiber: "7g",
      });
    }
  };

  const handleSaveMeal = async () => {
    if (!file || !nutritionData) return;

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Not signed in.");
      return;
    }

    const imageUrl = await uploadMealImage(file, user.id, "test-meal");
    if (!imageUrl) {
      alert("Image upload failed.");
      return;
    }

    // Store meal + meal items using server action
    await storeMeal(user.id, imageUrl);
    router.push("/protected/user-page");
  };

  const handleFitGoals = () => {
    alert("Feature coming soon: personalized nutrition adjustments.");
  };

  return (
    <main className="p-6 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">Food Nutrition Analyzer</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Upload Card */}
        <Card className="flex-1 bg-white border border-gray-200">
          <CardContent className="flex flex-col gap-4 p-6">
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="fileUpload"
              className="inline-block bg-black text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Upload Food Image
            </label>
            {image && (
              <img
                src={image}
                alt="Uploaded food"
                className="w-full max-w-md rounded-xl shadow-md"
              />
            )}
          </CardContent>
        </Card>

        {/* Nutrition Data Card */}
        {nutritionData && (
          <div>
            <Card className="flex-1 bg-white border border-black shadow-md">
              <CardContent className="p-6 font-sans text-black">
                <div className="border-b-8 border-black pb-2 mb-2">
                  <h2 className="text-2xl font-extrabold uppercase">
                    Nutrition Facts
                  </h2>
                </div>

                <div className="text-sm font-semibold mb-1">
                  Serving Size 1 meal
                </div>
                <div className="border-b border-black my-1"></div>

                <div className="text-sm font-semibold mb-1">
                  <span className="text-lg font-bold">Calories</span>:{" "}
                  {nutritionData.calories}
                </div>
                <div className="border-b-4 border-black my-2"></div>

                <ul className="text-sm space-y-1 font-medium">
                  <li>
                    <strong>Total Fat:</strong> {nutritionData.fat}
                  </li>
                  <li>
                    <em>Saturated Fat:</em> 6g
                  </li>
                  <li>
                    <em>Trans Fat:</em> 1g
                  </li>
                  <li>
                    <strong>Cholesterol:</strong> 90mg
                  </li>
                  <li>
                    <strong>Sodium:</strong> 500mg
                  </li>
                  <li>
                    <strong>Total Carbohydrate:</strong> {nutritionData.carbs}
                  </li>
                  <li>
                    <em>Dietary Fiber:</em> {nutritionData.fiber}
                  </li>
                  <li>
                    <em>Sugars:</em> 12g
                  </li>
                  <li>
                    <strong>Protein:</strong> {nutritionData.protein}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-10 mt-10">
              <Button
                onClick={handleSaveMeal}
                className="inline-block bg-black text-white px-4 py-2 rounded-lg cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Meal
              </Button>
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden "
              />
              <label
                htmlFor="fileUpload"
                className="inline-block bg-black text-white px-4 py-2 rounded-lg cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Retake Photo
              </label>
            </div>
          </div>
        )}
      </div>
      <NutritionSearch />
    </main>
  );
}
