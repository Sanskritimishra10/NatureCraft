import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    input: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const { name, input, password } = form;

      // ✅ Detect email or phone
      const isEmail = input.includes("@");
      const isPhone = /^[6-9]\d{9}$/.test(input);

      if (!isEmail && !isPhone) {
        throw new Error("Enter valid email or phone number");
      }

      // ✅ Build payload dynamically
      const payload = {
        name,
        password,
      };

      if (isEmail) {
        payload.email = input;
      } else {
        payload.phone = input;
      }

      // ✅ API call
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Signup failed");
      }

      // ✅ Success
      setMessage("Account created successfully. Please login.");
      setForm({ name: "", input: "", password: "" });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full overflow-hidden">
        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>

          <p className="text-gray-600 mt-2">
            Join Makhanify for healthy snacking
          </p>

          {message && (
            <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />

            <input
              type="text"
              name="input"
              placeholder="Email or Phone Number"
              value={form.input}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />

            <button
              disabled={isSubmitting}
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-700 cursor-pointer">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
