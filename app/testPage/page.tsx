"use client";

import React, { useEffect, useState } from "react";

export default function TestPage() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load image from localStorage on page load
  useEffect(() => {
    const storedImage = localStorage.getItem("uploadedImage");
    if (storedImage) {
      setImage(storedImage);
    }
  }, []);

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the new file
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error predicting food:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-3xl font-bold mb-4">🍽️ Food Classifier</h1>

      {/* Display the image preview */}
      {image ? (
        <div className="mb-6">
          <img
            src={image}
            alt="Uploaded Food"
            className="max-w-md mx-auto rounded-xl shadow-md"
          />
        </div>
      ) : (
        <p>No image uploaded yet.</p>
      )}

      {/* File input and predict button */}
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 mb-2"
        >
          Choose File
        </label>
        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 ml-2"
        >
          {loading ? "Analyzing..." : "Predict Food"}
        </button>
      </div>

      {/* Display results */}
      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">🔍 Predictions:</h2>
          <ul className="space-y-1">
            {results.map((result, i) => (
              <li key={i} className="text-lg">
                <strong>{result.food}</strong> – {(result.confidence * 100).toFixed(1)}% confidence
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}