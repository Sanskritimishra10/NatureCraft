import React from "react";
import { FaLeaf, FaHeart, FaFire } from "react-icons/fa";

export default function Hero() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-12 px-6 md:px-10 py-16 bg-gradient-to-r from-green-50 to-white">
      
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold text-gray-800 leading-tight">
          Premium Roasted <span className="text-green-700">Makhana</span>
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          Healthy. Crunchy. Guilt-Free snacking for your daily lifestyle.
        </p>

        {/* 🔥 Replace buttons with highlights */}
        <div className="mt-8 flex flex-wrap gap-4">

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
            <FaLeaf className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              100% Natural
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
            <FaHeart className="text-red-500" />
            <span className="text-sm font-medium text-gray-700">
              Heart Healthy
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
            <FaFire className="text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              Low Calories
            </span>
          </div>

        </div>
      </div>

      <img
        src="https://commons.wikimedia.org/wiki/Special:FilePath/Roasted%20and%20spiced%20Foxnuts%20(Phool%20Makhana).jpg?width=900"
        alt="Roasted and spiced phool makhana"
        className="w-full max-w-[420px] h-[320px] object-cover rounded-xl shadow-xl"
      />
    </div>
  );
}