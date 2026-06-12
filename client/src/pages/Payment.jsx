import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaCreditCard,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaShieldAlt,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { apiJson } from "../lib/api";

const paymentOptions = [
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay when your fresh makhana reaches your doorstep.",
    icon: FaMoneyBillWave,
  },
  {
    id: "card",
    title: "Credit / Debit Card",
    description: "Use Visa, Mastercard, RuPay, or your preferred bank card.",
    icon: FaCreditCard,
  },
  {
    id: "upi",
    title: "UPI Payment",
    description: "Pay instantly through PhonePe, GPay, Paytm, or any UPI app.",
    icon: FaMobileAlt,
  },
];

function Payment() {
  const { state } = useLocation();
  const { total = 0, address, fullName, phone } = state || {};

  const [method, setMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const selectedMethod = paymentOptions.find((option) => option.id === method);

  const placeFinalOrder = async () => {
    setIsPlacingOrder(true);

    try {
      await apiJson("/api/order", {
        method: "POST",
        body: JSON.stringify({
          address,
          fullName,
          phone,
          paymentMethod: method,
          total,
        }),
      });

      alert("Payment successful");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              Secure checkout
            </p>
            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              Complete your payment
            </h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Choose how you want to pay and we will prepare your makhana order.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-white px-4 py-3 shadow-sm">
            <FaShieldAlt className="text-green-700" />
            <span className="text-sm font-medium text-gray-700">
              Protected payment
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3 text-green-700">
                <FaWallet />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Payment method
                </h2>
                <p className="text-sm text-gray-500">
                  Select the option that works best for you.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = method === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setMethod(option.id)}
                    className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition ${
                      isSelected
                        ? "border-green-700 bg-green-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50"
                    }`}
                  >
                    <span
                      className={`rounded-lg p-3 ${
                        isSelected
                          ? "bg-green-700 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon />
                    </span>

                    <span className="flex-1">
                      <span className="block font-semibold text-gray-900">
                        {option.title}
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        {option.description}
                      </span>
                    </span>

                    {isSelected && (
                      <FaCheckCircle className="text-xl text-green-700" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-800">
                Selected: {selectedMethod?.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Your order will be confirmed after payment details are saved.
              </p>
            </div>
          </section>

          <aside className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900">Order summary</h2>

            <div className="mt-6 space-y-4 text-sm text-gray-700">
              <div className="flex gap-3">
                <FaUser className="mt-1 text-green-700" />
                <div>
                  <p className="font-semibold text-gray-900">Customer</p>
                  <p>{fullName || "Not provided"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <FaPhoneAlt className="mt-1 text-green-700" />
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p>{phone || "Not provided"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <FaMapMarkerAlt className="mt-1 text-green-700" />
                <div>
                  <p className="font-semibold text-gray-900">Delivery address</p>
                  <p>{address || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="my-6 border-t border-gray-200"></div>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-semibold text-green-700">Free</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4 text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
            </div>

            <button
              onClick={placeFinalOrder}
              disabled={isPlacingOrder}
              className="mt-6 w-full rounded-lg bg-green-700 py-3 font-semibold text-white shadow-lg transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isPlacingOrder ? "Processing..." : `Pay Rs. ${total}`}
            </button>

            <p className="mt-4 text-center text-xs text-gray-500">
              No hidden charges. Fresh makhana, packed with care.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Payment;
