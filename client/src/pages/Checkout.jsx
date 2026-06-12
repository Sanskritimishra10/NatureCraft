import React, { useEffect, useState } from "react";
import { FaHome, FaSave } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { apiJson } from "../lib/api";

function Checkout() {
  const [cart, setCart] = useState([]);

  const [flat, setFlat] = useState("");
  const [locality, setLocality] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const[pincode,setPincode]=useState("");
  const[city,setCity]=useState("");
  const [addressType, setAddressType] = useState("home");

  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [step, setStep] = useState(1); // 🔥 step control

  const navigate = useNavigate();

  // ================= FETCH DATA =================
  const fetchCart = async () => {
    try {
      const data = await apiJson("/api/cart");
      setCart(data?.items || []);
    } catch (error) {
      if (error.message === "No token" || error.message === "Invalid token") {
        navigate("/login");
      }
    }
  };

  const fetchSavedAddress = async () => {
    try {
      const data = await apiJson("/api/auth/address");

      if (!data.address) return;

      setFullName(data.address.fullName || "");
      setPhone(data.address.phone || "");
      setAltPhone(data.address.altPhone || "");
      setFlat(data.address.flat || "");
      setLocality(data.address.locality || "");
      setPincode(data.address.pincode || "");
      setCity(data.address.city || "");
      setAddressType(data.address.addressType || "home");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchSavedAddress();
  }, []);

  // ================= LOGIC =================
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryAddress = `${flat}, ${locality}`;

  const validateAddress = () => {
    if (!flat || !locality || !fullName || !phone || !pincode || !city) {
      alert("Please fill all required address fields");
      return false;
    }
    return true;
  };

  const saveAddress = async () => {
    if (!validateAddress()) return;

    setIsSavingAddress(true);

    try {
      await apiJson("/api/auth/address", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          phone,
          altPhone,
          flat,
          locality,
          pincode,
          city,
          addressType,
        }),
      });

      setSaveMessage("Address saved successfully");
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );

          const data = await res.json();

          if (data?.display_name) {
            setLocality(data.display_name);
          }
        } catch (err) {
          alert("Error fetching address");
        }
      },
      () => {
        alert("Unable to fetch location");
      },
    );
  };

  const placeOrder = async () => {
    if (!validateAddress()) return;

    await saveAddress();

    navigate("/payment", {
      state: {
        address: deliveryAddress,
        fullName,
        phone,
        total,
        city,
        pincode
      },
    });
  };

  // ================= UI =================
  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div>
          {/* STEP 1: LOCATION */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-2xl shadow border">
              <h2 className="text-lg font-semibold mb-3">
                Select Delivery Location
              </h2>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-green-700 text-white py-3 rounded-xl mb-3 hover:bg-green-700"
              >
                Enter address manually
              </button>

              <button
                onClick={() => {
                  handleUseCurrentLocation();
                  setStep(2);
                }}
                className="w-full border border-green-700 text-green-600 py-3 rounded-xl hover:bg-green-50"
              >
                Use current location 📍
              </button>
            </div>
          )}

          {/* STEP 2: ADDRESS FORM */}
          {step >= 2 && (
            <div className="bg-white p-6 rounded-2xl shadow border mt-4 space-y-4">
              <h2 className="text-lg font-semibold">Enter Address</h2>

              <input
                type="text"
                placeholder="Flat / House *"
                value={flat}
                onChange={(e) => setFlat(e.target.value)}
                className="w-full border p-3 rounded-xl"
              />

              <textarea
                placeholder="Locality *"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full border p-3 rounded-xl"
              />

              <input
                type="text"
                placeholder="Full Name *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border p-3 rounded-xl"
              />

              <input
                type="text"
                placeholder="Phone *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border p-3 rounded-xl"
              />

               <input
                type="number"
                placeholder="Pincode *"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full border p-3 rounded-xl"
              />

               <input
                type="text"
                placeholder="City *"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border p-3 rounded-xl"
              />

              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={() => setAddressType("home")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl border transition ${
                    addressType === "home"
                      ? "bg-green-100 border-green-600 text-green-700"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <FaHome /> Home
                </button>

                <button
                  onClick={() => setAddressType("work")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl border transition ${
                    addressType === "work"
                      ? "bg-green-100 border-green-600 text-green-700"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <MdWork /> Work
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 3 && (
            <div className="mt-4 bg-green-50 p-5 rounded-xl border">
              <h3 className="font-semibold mb-2">Review Order</h3>

              <p>{fullName}</p>
              <p>{phone}</p>
              <p>
                {flat}, {locality}
              </p>
              <p>{city},{pincode}</p>

              <button
                onClick={placeOrder}
                className="mt-4 w-full bg-green-700 text-white py-3 rounded-xl"
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-6 rounded-xl shadow sticky top-20 h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.productId} className="flex justify-between mb-2">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr className="my-3" />

          <h3 className="text-lg font-bold">Total: ₹{total}</h3>
          <button
            onClick={placeOrder}
            className="mt-6 mx-auto block bg-green-700 text-white px-6 py-2 rounded-md text-sm hover:bg-green-800 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
