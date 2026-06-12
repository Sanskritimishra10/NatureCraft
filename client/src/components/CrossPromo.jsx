import React from "react";

export default function CrossPromo() {
  return (
    <section className="relative py-24 px-6 md:px-20">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://commons.wikimedia.org/wiki/Special:FilePath/Framed%20wall%20art%20(Unsplash).jpg?width=1400"
          alt="Framed canvas artwork in a modern home"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Elevate Your Space While You Snack 🎨
        </h2>

        <p className="mt-4 text-gray-200 text-lg">
          Discover premium canvas paintings from our sister brand{" "}
          <span className="font-semibold text-white">CanvasAura</span>.
          Perfect for modern homes and aesthetic living.
        </p>

        <div className="mt-8 flex gap-4">
          
          <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-200 transition">
            Explore CanvasAura →
          </button>

          <button className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition">
            Learn More
          </button>

        </div>
      </div>
    </section>
  );
}
