import React from "react";

export default function Benefits() {
  const benefits = [
    {
      icon: "💪",
      title: "High Protein",
      desc: "Supports muscle growth and keeps you energized throughout the day."
    },
    {
      icon: "🔥",
      title: "Low Calories",
      desc: "Perfect guilt-free snack for weight management and healthy living."
    },
    {
      icon: "🌾",
      title: "Gluten-Free",
      desc: "Safe and nutritious for gluten-sensitive diets."
    }
  ];

  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-20 px-6 md:px-20">
      
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800">
          Why Choose <span className="text-green-700">Makhanify?</span>
        </h2>
        <p className="mt-4 text-gray-600">
          Healthy snacking redefined with premium quality fox nuts sourced directly from farms.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {benefits.map((item, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2"
          >
            <div className="text-4xl">{item.icon}</div>

            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              {item.title}
            </h3>

            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}