import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiJson } from "../lib/api";

export default function Login() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sendOTP = async () => {
    try {
      await apiJson("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ input }),
      });

      setStep(2);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyOTP = async () => {
  try {
    const data = await apiJson("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ input, otp }),
    });

    window.dispatchEvent(new Event("authChange"));

    setTimeout(() => {
      navigate("/");
    }, 100);

  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Login with OTP</h2>

        <p className="text-gray-500 text-center mb-6">
          Enter your email or mobile number
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Email or Mobile Number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <button
              onClick={sendOTP}
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <button
              onClick={verifyOTP}
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition"
            >
              Verify & Login
            </button>

            <button
              onClick={() => setStep(1)}
              className="mt-3 text-sm text-gray-500 hover:underline"
            >
              Change number/email
            </button>
          </>
        )}

        <p className="mt-6 text-sm text-gray-600 text-center">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-700 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
