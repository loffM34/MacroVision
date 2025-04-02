// utils/fetchNutritionData.ts
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

export async function fetchNutritionData(query: string): Promise<Food | null> {
  const apiKey = "4nocG4ecRrNsudAmboxE5m7cBDfEtVbd6bdmHyBG";
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${query}&pageSize=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.foods || data.foods.length === 0) {
      return null;
    }

    return data.foods[0] as Food;
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    throw new Error("Failed to fetch nutrition data");
  }
}
