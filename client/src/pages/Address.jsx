import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { apiJson } from "../lib/api";

function Address() {
  const navigate = useNavigate();

  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // 🔥 FORM STATES
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [flat, setFlat] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressType, setAddressType] = useState("home");

  // ================= FETCH ADDRESS =================
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const data = await apiJson("/api/auth/address");

        if (data.address) {
          setAddress(data.address);

          // 🔥 Prefill form
          setFullName(data.address.fullName || "");
          setPhone(data.address.phone || "");
          setAltPhone(data.address.altPhone || "");
          setFlat(data.address.flat || "");
          setLocality(data.address.locality || "");
          setCity(data.address.city || "");
          setStateName(data.address.state || "");
          setPincode(data.address.pincode || "");
          setAddressType(data.address.addressType || "home");
        }
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  // ================= SAVE ADDRESS =================
  const saveAddress = async () => {
    try {
      const data = await apiJson("/api/auth/address", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          phone,
          altPhone,
          flat,
          locality,
          city,
          state: stateName,
          pincode,
          addressType,
        }),
      });

      setAddress(data.address);
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6efe4] to-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2a241d]">Saved Address</h1>
          <p className="text-gray-500 mt-2">Manage your delivery details</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          {/* LOADING */}
          {loading && (
            <div className="text-center py-10 text-gray-500">
              Loading your address...
            </div>
          )}

          {/* ================= VIEW MODE ================= */}
          {!loading && address && !isEditing && (
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaHome className="text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {address.fullName}
                    </h2>
                    <p className="text-gray-500 text-sm">{address.phone}</p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {address.flat}, {address.locality}, {address.city},{" "}
                  {address.state} - {address.pincode}
                </p>

                <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded-full capitalize">
                  {address.addressType}
                </span>
              </div>

              {/* EDIT BUTTON */}
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 rounded-lg bg-green-700 text-white text-sm hover:bg-green-800 transition"
              >
                Edit
              </button>
            </div>
          )}

          {/* ================= EMPTY STATE ================= */}
          {!loading && !address && !isEditing && (
            <div className="flex flex-col items-center text-center py-16">
              <div className="bg-green-50 p-6 rounded-full mb-4">
                <FaHome size={28} className="text-green-700" />
              </div>

              <h2 className="text-xl font-semibold">No Address Added</h2>

              <p className="text-gray-500 mt-2 max-w-sm">
                Add your delivery address to continue shopping
              </p>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 bg-green-700 text-white px-6 py-3 rounded-xl shadow hover:bg-green-800 transition"
              >
                + Add Address
              </button>
            </div>
          )}

          {/* ================= EDIT MODE ================= */}
          {isEditing && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">
                {address ? "Edit Address" : "Add Address"}
              </h2>

              {/* FORM */}
              <div className="grid md:grid-cols-2 gap-5">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="input"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="input"
                />
                <input
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="Alternate Phone"
                  className="input"
                />
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode"
                  className="input"
                />

                <input
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                  placeholder="Flat / House / Building"
                  className="input md:col-span-2"
                />
                <textarea
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="Area / Locality"
                  className="input md:col-span-2"
                />

                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="input"
                />
                <input
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="State"
                  className="input"
                />
              </div>

              {/* ADDRESS TYPE */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setAddressType("home")}
                  className={`px-6 py-2 rounded-full border transition ${
                    addressType === "home"
                      ? "bg-green-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  🏠 Home
                </button>

                <button
                  onClick={() => setAddressType("work")}
                  className={`px-6 py-2 rounded-full border transition ${
                    addressType === "work"
                      ? "bg-green-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  💼 Work
                </button>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={saveAddress}
                  className="px-6 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 shadow"
                >
                  Save Address
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Address;
