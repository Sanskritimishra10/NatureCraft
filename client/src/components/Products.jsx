import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiJson } from "../lib/api";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [wishlistIds, setWishlistIds] = useState([]);

  const fetchProducts = async () => {
    const data = await apiJson("/products");
    setProducts(data);

    const initialQty = {};
    data.forEach((product) => {
      initialQty[product.id] = initialQty[product.id] || 1;
    });
    setQuantities(initialQty);
  };

  const fetchWishlist = async () => {
    try {
      const data = await apiJson("/api/auth/wishlist");
      setWishlistIds(data.items.map((item) => item.id));
    } catch (error) {
      setWishlistIds([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();

    window.addEventListener("wishlistChange", fetchWishlist);

    return () => {
      window.removeEventListener("wishlistChange", fetchWishlist);
    };
  }, []);

  const increaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

 const addToCart = async (product) => {
  const token = localStorage.getItem("token");

  // ✅ CHECK LOGIN FIRST
  if (!token) {
    setMessage("Please login first");
    navigate("/login", { state: { from: "/shop" } });
    return;
  }

  try {
    await apiJson("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({
        productId: product.id,
        quantity: quantities[product.id],
      }),
    });

    window.dispatchEvent(new Event("cartChange"));
  } catch (error) {
    alert(error.message);
  }
};

 const toggleWishlist = async (product) => {
  const token = localStorage.getItem("token");

  if (!token) {
   setMessage("Please login first");
    navigate("/login", { state: { from: "/shop" } });
    return;
  }

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

  return (
    <div className="px-10 py-16">
      <h2 className="text-3xl font-bold mb-10 text-center">Best Sellers</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {products.map((product) => {
          const isWishlisted = wishlistIds.includes(product.id);

          return (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full rounded-lg object-cover"
              />

              <h3 className="mt-4 font-semibold text-lg">{product.name}</h3>

              <p className="text-green-700 font-bold mt-2">Rs. {product.price}</p>

              <div className="flex items-center justify-between mt-3 border rounded-lg px-2 py-1">
                <button
                  onClick={() => decreaseQty(product.id)}
                  className="px-2 text-lg"
                >
                  -
                </button>

                <span>{quantities[product.id]}</span>

                <button
                  onClick={() => increaseQty(product.id)}
                  className="px-2 text-lg"
                >
                  +
                </button>
              </div>

              <div className="flex items-center justify-between mt-4 gap-2">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full shadow-sm transition-all duration-200 ${
                    isWishlisted
                      ? "bg-red-100 text-red-500 scale-110"
                      : "bg-white text-gray-400 hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
