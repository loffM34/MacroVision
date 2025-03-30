"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card/card";
import { CardContent } from "@/components/ui/card/cardcontent";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [image, setImage] = useState<string | null>(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [nutritionData, setNutritionData] = useState<{
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      // Simulate nutrition data
      setNutritionData({
        calories: 520,
        protein: "24g",
        carbs: "58g",
        fat: "22g",
        fiber: "7g",
      });
    }
  };

  const handleFitGoals = () => {
    alert("Feature coming soon: personalized nutrition adjustments.");
  };

  return (
    <main className="p-6 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">Food Nutrition Analyzer</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Upload Card */}
        <Card className="flex-1 bg-white border border-gray-200 ">
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
            <Card className="flex-1 bg-white dark:bg-white border border-black shadow-md">
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
                    <strong>Total Fat:</strong> {nutritionData.protein}
                  </li>
                  <li>
                    <em>Saturated Fat:</em> {nutritionData.protein}
                  </li>
                  <li>
                    <em>Trans Fat:</em> {nutritionData.protein}
                  </li>
                  <li>
                    <strong>Cholesterol:</strong> {nutritionData.protein}
                  </li>
                  <li>
                    <strong>Sodium:</strong> {nutritionData.protein}
                  </li>
                  <li>
                    <strong>Total Carbohydrate:</strong> {nutritionData.protein}
                  </li>
                  <li>
                    <em>Dietary Fiber:</em> {nutritionData.protein}
                  </li>
                  <li>
                    <em>Sugars:</em> {nutritionData.protein}
                  </li>
                  <li>
                    <strong>Protein:</strong> {nutritionData.protein}
                  </li>
                </ul>

                <div className="border-t border-black mt-4 pt-2">
                  <Button
                    onClick={handleFitGoals}
                    className="mt-4 bg-black text-white hover:bg-gray-800"
                  >
                    Make This Fit My Goals
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div>
              <div className="flex justify-center gap-10 mt-10">
                <Button onClick={(e) => setShowLoginMessage(true)}>
                  Save Meal
                </Button>
                <Button>Retake Photo</Button>
              </div>
              {showLoginMessage && (
                <div className="text-center mt-5">Login to save your meal!</div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </main>
  );
}
