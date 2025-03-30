// components/NutritionSearch.tsx
import { useState } from "react";

type Nutrient = {
  nutrientId: number;
  nutrientName: string;
  unitName: string;
  value: number;
};

type Food = {
  description: string;
  foodNutrients: Nutrient[];
};

export default function NutritionSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Food | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `/api/search-food?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Nutrition Lookup</h2>
      <input
        type="text"
        placeholder="Enter food (e.g. banana)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-3 py-2 w-full rounded mb-2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {result && (
        <div className="mt-4 border p-4 rounded shadow">
          <h3 className="font-semibold text-lg">{result.description}</h3>
          <ul className="mt-2 space-y-1">
            {result.foodNutrients.slice(0, 5).map((n) => (
              <li key={n.nutrientId}>
                {n.nutrientName}: {n.value} {n.unitName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
