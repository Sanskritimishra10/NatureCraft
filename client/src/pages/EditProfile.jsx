import React, { useEffect, useState } from "react";
import { apiJson } from "../lib/api";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // 🔥 section-based editing
  const [editSection, setEditSection] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState({
    flat: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [originalData, setOriginalData] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiJson("/api/auth/me");
        const user = data.user;

        const profile = {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        };

        const addr = user.savedAddress || {};

        const addressData = {
          flat: addr.flat || "",
          locality: addr.locality || "",
          city: addr.city || "",
          state: addr.state || "",
          pincode: addr.pincode || "",
        };

        setForm(profile);
        setAddress(addressData);

        setOriginalData({
          ...profile,
          ...addressData,
        });
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ================= HANDLE =================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddressChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  // ================= CHECK =================
  const hasChanges = () => {
    const current = { ...form, ...address };
    return JSON.stringify(current) !== JSON.stringify(originalData);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    setMessage("");
    setError("");

    if (!hasChanges()) {
      setMessage("No changes detected");
      return;
    }

    try {
      await apiJson("/api/auth/update", {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          savedAddress: address,
        }),
      });

      setOriginalData({ ...form, ...address });
      setEditSection(null);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-semibold mb-6">
          My Profile
        </h1>

        {/* MESSAGE */}
        {message && (
          <p className="bg-green-50 text-green-700 p-3 rounded mb-4">
            {message}
          </p>
        )}

        {error && (
          <p className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* ================= PERSONAL INFO ================= */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">
                  Personal Information
                </h2>

                <button
                  onClick={() =>
                    setEditSection(
                      editSection === "name" ? null : "name"
                    )
                  }
                  className="text-blue-600 text-sm"
                >
                  {editSection === "name" ? "Cancel" : "Edit"}
                </button>
              </div>

              {editSection === "name" ? (
                <div className="flex gap-3">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  />
                  <button
                    onClick={handleSave}
                    className="bg-green-700 text-white px-4 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="border p-3 rounded">{form.name}</p>
              )}
            </div>

            {/* ================= EMAIL ================= */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">
                  Email Address
                </h2>

                <button
                  onClick={() =>
                    setEditSection(
                      editSection === "email" ? null : "email"
                    )
                  }
                  className="text-blue-600 text-sm"
                >
                  {editSection === "email" ? "Cancel" : "Edit"}
                </button>
              </div>

              {editSection === "email" ? (
                <div className="flex gap-3">
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  />
                  <button
                    onClick={handleSave}
                    className="bg-green-700 text-white px-4 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="border p-3 rounded">
                  {form.email || "—"}
                </p>
              )}
            </div>

            {/* ================= PHONE ================= */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">
                  Mobile Number
                </h2>

                <button
                  onClick={() =>
                    setEditSection(
                      editSection === "phone" ? null : "phone"
                    )
                  }
                  className="text-blue-600 text-sm"
                >
                  {editSection === "phone" ? "Cancel" : "Edit"}
                </button>
              </div>

              {editSection === "phone" ? (
                <div className="flex gap-3">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  />
                  <button
                    onClick={handleSave}
                    className="bg-green-700 text-white px-4 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="border p-3 rounded">
                  {form.phone || "—"}
                </p>
              )}
            </div>

            {/* ================= ADDRESS ================= */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">
                  Saved Address
                </h2>

                <button
                  onClick={() =>
                    setEditSection(
                      editSection === "address" ? null : "address"
                    )
                  }
                  className="text-blue-600 text-sm"
                >
                  {editSection === "address" ? "Cancel" : "Edit"}
                </button>
              </div>

              {editSection === "address" ? (
                <div className="space-y-3">
                  <input name="flat" value={address.flat} onChange={handleAddressChange} className="border p-2 w-full rounded" placeholder="Flat" />
                  <input name="locality" value={address.locality} onChange={handleAddressChange} className="border p-2 w-full rounded" placeholder="Locality" />
                  <input name="city" value={address.city} onChange={handleAddressChange} className="border p-2 w-full rounded" placeholder="City" />
                  <input name="state" value={address.state} onChange={handleAddressChange} className="border p-2 w-full rounded" placeholder="State" />
                  <input name="pincode" value={address.pincode} onChange={handleAddressChange} className="border p-2 w-full rounded" placeholder="Pincode" />

                  <button
                    onClick={handleSave}
                    className="bg-green-700 text-white px-5 py-2 rounded"
                  >
                    Save Address
                  </button>
                </div>
              ) : (
                <p className="border p-3 rounded">
                  {address.flat}, {address.locality}, {address.city},{" "}
                  {address.state} - {address.pincode}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EditProfile;