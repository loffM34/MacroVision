"use client";
//Home Page
import { useState, useEffect } from "react";
import { fetchNutritionData } from "@/components/NutritionSearch";
import { UploadCloud, Loader2, Utensils } from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

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
        predictions.map(async (item: any) => {
          const cleanedFood = item.food.replace(/_/g, " ");
          const foodDetails = await fetchNutritionData(cleanedFood);
          const nutrients: any = {};

          if (foodDetails) {
            foodDetails.foodNutrients.forEach((nutrient: any) => {
              const name = nutrient.nutrientName.toLowerCase();
              const value = nutrient.value;

              if (name.includes("protein")) nutrients.protein = `${value}g`;
              if (name.includes("lipid")) nutrients.fat = `${value}g`;
              if (name.includes("carbohydrate")) nutrients.carbs = `${value}g`;
              if (name.includes("fiber")) nutrients.fiber = `${value}g`;
              if (name.includes("sugars")) nutrients.sugars = `${value}g`;
              if (name.includes("cholesterol"))
                nutrients.cholesterol = `${value}mg`;
              if (name.includes("sodium")) nutrients.sodium = `${value}mg`;
              if (name.includes("energy")) nutrients.calories = `${value}`;
            });
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 py-12 px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3">
          <Utensils className="w-10 h-10 text-green-500" /> MacroVision
        </h1>

        <div className="border-2 border-dashed border-green-400 rounded-xl p-8 text-center">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-md mx-auto rounded-lg shadow-md mb-6"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="mx-auto mb-6 block"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 transition-all text-white px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
            {loading ? "Analyzing..." : "Upload & Predict"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {results.map((item, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold capitalize mb-2">
                  🍽️ {item.food} — {(item.confidence * 100).toFixed(1)}%
                </h2>
                <div className="border-b border-gray-300 my-2"></div>
                <h3 className="font-bold text-lg uppercase mb-1">
                  Nutrition Facts <p className="text-xs">Per 100 Grams</p>
                </h3>
                <ul className="text-gray-700">
                  <li>
                    <strong>Calories:</strong>{" "}
                    {item.nutritionData.calories || "—"}
                  </li>
                  <li>
                    <strong>Total Fat:</strong> {item.nutritionData.fat || "—"}
                  </li>
                  <li>
                    <strong>Cholesterol:</strong>{" "}
                    {item.nutritionData.cholesterol || "—"}
                  </li>
                  <li>
                    <strong>Sodium:</strong> {item.nutritionData.sodium || "—"}
                  </li>
                  <li>
                    <strong>Total Carbs:</strong>{" "}
                    {item.nutritionData.carbs || "—"}
                  </li>
                  <li>
                    <strong>Dietary Fiber:</strong>{" "}
                    {item.nutritionData.fiber || "—"}
                  </li>
                  <li>
                    <strong>Sugars:</strong> {item.nutritionData.sugars || "—"}
                  </li>
                  <li>
                    <strong>Protein:</strong>{" "}
                    {item.nutritionData.protein || "—"}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
