import React from "react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-r from-green-50 to-white">
      
      <h1 className="text-4xl font-bold text-gray-800">
        About Makhanify 🌰
      </h1>

      <p className="mt-6 max-w-2xl text-gray-600 text-lg">
        Makhanify brings you premium quality makhana sourced directly from Bihar’s farms.
        Our mission is to make healthy snacking accessible, tasty, and affordable.
      </p>

      {/* Button to go to Story */}
      <button
        onClick={() => navigate("/story")}
        className="mt-8 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
      >
        Read Our Story →
      </button>

    </div>
  );
}