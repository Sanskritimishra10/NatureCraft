import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { apiJson } from "../lib/api";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const data = await apiJson("/api/auth/wishlist");
      setWishlist(data.items || []);
    } catch (error) {
      setWishlist([]);
      if (error.message === "No token" || error.message === "Invalid token") {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchWishlist();

    window.addEventListener("wishlistChange", fetchWishlist);

    return () => window.removeEventListener("wishlistChange", fetchWishlist);
  }, []);

  const removeFromWishlist = async (product) => {
    try {
      await apiJson("/api/auth/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
      });

      await fetchWishlist();
      window.dispatchEvent(new Event("wishlistChange"));
    } catch (error) {
      alert(error.message);
    }
  };

  const addToCart = async (product) => {
    try {
      await apiJson("/api/cart/add", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      window.dispatchEvent(new Event("cartChange"));
      alert("Added to cart");
    } catch (error) {
      alert(error.message);
      if (error.message === "No token" || error.message === "Invalid token") {
        navigate("/login");
      }
    }
  };

  return (
    <div className="bg-[#f6efe4] px-6 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#2a241d]">Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="text-xl font-semibold text-gray-700">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mt-2">
              Start adding your favorite makhana.
            </p>

            <button
              onClick={() => navigate("/shop")}
              className="mt-6 bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Explore Shop
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-[#fffaf2] rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-64 w-full object-cover"
                  />

                  <button
                    onClick={() => removeFromWishlist(product)}
                    className="absolute top-4 right-4 bg-white p-3 rounded-full shadow"
                  >
                    <FaHeart className="text-red-500" />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold">{product.name}</h3>

                  <p className="text-green-700 font-semibold mt-2">
                    Rs. {product.price}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-green-700 text-white py-2 rounded-lg"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => navigate("/shop")}
                      className="border px-3 rounded-lg"
                    >
                      Browse
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
