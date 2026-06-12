import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { apiJson } from "../lib/api";

function Cart() {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await apiJson("/api/cart");
      setCart(data.items || []);
      setError("");
      setIsAuthenticated(true);
    } catch (err) {
      if (err.message === "No token" || err.message === "Invalid token") {
        setIsAuthenticated(false);
        setCart([]);
        return;
      }

      setError(err.message);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      await apiJson("/api/cart/remove", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });

      fetchCart();
      window.dispatchEvent(new Event("cartChange"));
    } catch (err) {
      alert(err.message);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await apiJson("/api/cart/update", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      });

      fetchCart();
      window.dispatchEvent(new Event("cartChange"));
    } catch (err) {
      alert(err.message);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>

      {!isAuthenticated ? (
        <p className="text-lg">
          Please{" "}
          <Link to="/login" className="text-green-700 font-semibold underline">
            login
          </Link>{" "}
          to view your cart.
        </p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : cart.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <Link
            to="/shop"
            className="mt-4 inline-block bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 shrink-0 rounded-lg object-cover bg-gray-100"
                  />

                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-800">{item.name}</h2>

                    <div className="mt-1">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.productId, Number(e.target.value))
                        }
                        className="border px-2 py-1 rounded-md text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((q) => (
                          <option key={q} value={q}>
                            Qty: {q}
                          </option>
                        ))}
                      </select>
                    </div>

                    <p className="text-green-700 font-bold mt-1">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Order Summary
            </h2>

            <div className="flex justify-between mb-2 text-gray-600">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex justify-between mb-4 text-gray-600">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>

            <hr className="mb-4" />

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
