import { createBrowserClient } from "@supabase/ssr";

export const uploadMealImage = async (file: File, userId: string, mealId: string) => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const filePath = `${userId}/${mealId}-${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("meal-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload failed:", error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("meal-images")
    .getPublicUrl(filePath);

  return publicUrlData?.publicUrl;
};
