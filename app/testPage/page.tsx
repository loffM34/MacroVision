"use client";

import { useState } from "react";
import { fetchNutritionData } from "@/components/NutritionSearch";

type NutrientData = {
  calories?: string;
  fat?: string;
  carbs?: string;
  fiber?: string;
  sugars?: string;
  cholesterol?: string;
  sodium?: string;
  protein?: string;
};

type ResultItem = {
  food: string;
  confidence: number;
  nutritionData: NutrientData;
};

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const predictions = data.results || [];

      const enrichedResults = await Promise.all(
        predictions.map(async (item: { food: string; confidence: number }) => {
          const cleanedFood = item.food.replace(/_/g, " ");
          const foodDetails = await fetchNutritionData(cleanedFood);
          const nutrients: NutrientData = {};

          if (foodDetails) {
            for (const nutrient of foodDetails.foodNutrients) {
              const name = nutrient.nutrientName.toLowerCase();

              switch (name) {
                case "protein":
                  nutrients.protein = `${nutrient.value}g`;
                  break;
                case "total lipid (fat)":
                  nutrients.fat = `${nutrient.value}g`;
                  break;
                case "carbohydrate, by difference":
                  nutrients.carbs = `${nutrient.value}g`;
                  break;
                case "fiber, total dietary":
                  nutrients.fiber = `${nutrient.value}g`;
                  break;
                case "total sugars":
                  nutrients.sugars = `${nutrient.value}g`;
                  break;
                case "cholesterol":
                  nutrients.cholesterol = `${nutrient.value}mg`;
                  break;
                case "sodium, na":
                  nutrients.sodium = `${nutrient.value}mg`;
                  break;
                case "energy":
                  nutrients.calories = `${nutrient.value}`;
                  break;
              }
            }
          }

          return {
            food: cleanedFood,
            confidence: item.confidence,
            nutritionData: nutrients,
          };
        })
      );

      setResults(enrichedResults);
    } catch (err) {
      console.error("Upload or prediction failed:", err);
      alert("Something went wrong while uploading or predicting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🍽️ Food Classifier</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Analyzing..." : "Upload & Predict"}
      </button>

      {results.length > 0 && (
        <div className="mt-6 space-y-6">
          {results.map((item, i) => (
            <div
              key={i}
              className="border p-4 rounded shadow bg-white text-black"
            >
              <h2 className="text-xl font-bold mb-1 capitalize">
                🍽️ {item.food} — {(item.confidence * 100).toFixed(1)}%
              </h2>

              <h3 className="text-2xl font-extrabold uppercase mt-2">
                Nutrition Facts
              </h3>

              <div className="text-sm font-semibold mb-1">
                Serving Size 1 meal
              </div>
              <div className="border-b border-black my-1"></div>

              <div className="text-sm font-semibold mb-1">
                <span className="text-lg font-bold">Calories</span>:{" "}
                {item.nutritionData.calories || "—"}
              </div>
              <div className="border-b-4 border-black my-2"></div>

              <ul className="text-sm space-y-1 font-medium">
                <li>
                  <strong>Total Fat:</strong> {item.nutritionData.fat || "—"}
                </li>
                <li>
                  <em>Saturated Fat:</em> 0.25g
                </li>
                <li>
                  <em>Trans Fat:</em> 0.01g
                </li>
                <li>
                  <strong>Cholesterol:</strong>{" "}
                  {item.nutritionData.cholesterol || "—"}
                </li>
                <li>
                  <strong>Sodium:</strong> {item.nutritionData.sodium || "—"}
                </li>
                <li>
                  <strong>Total Carbohydrate:</strong>{" "}
                  {item.nutritionData.carbs || "—"}
                </li>
                <li>
                  <em>Dietary Fiber:</em> {item.nutritionData.fiber || "—"}
                </li>
                <li>
                  <em>Sugars:</em> {item.nutritionData.sugars || "—"}
                </li>
                <li>
                  <strong>Protein:</strong> {item.nutritionData.protein || "—"}
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
