import React from "react";
import { useNavigate } from "react-router-dom";

export default function Story() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-white to-green-50 py-20 px-6 md:px-20">
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Image */}
        <div className="flex-1">
          <img
            src="https://commons.wikimedia.org/wiki/Special:FilePath/Foxnut%20Makhana%20-%20Nawada%20District%20-%20Bihar%20-%201.jpg?width=900"
            alt="Foxnut makhana harvested in Nawada District, Bihar"
            className="h-[420px] w-full rounded-2xl object-cover shadow-xl"
          />
        </div>

        {/* Text Content */}
        <div className="flex-1">
          
          <h2 className="text-4xl font-bold text-gray-800 leading-tight">
            From <span className="text-green-700">Bihar’s Farms</span> to Your Home
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed text-lg">
            At Makhanify, we bring you the finest quality makhana sourced directly
            from the heart of Bihar. Our farmers follow traditional methods to ensure
            purity, freshness, and unmatched taste in every bite.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Every pack you enjoy supports local farmers and promotes sustainable agriculture.
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate("/shop")}
            className="mt-8 bg-green-700 text-white px-6 py-3 rounded-lg shadow hover:bg-green-800 transition"
          >
            Explore Products →
          </button>

        </div>
      </div>
    </section>
  );
}