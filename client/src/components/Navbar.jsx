import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBox,
  FaHeart,
  FaLeaf,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import { MdHelpOutline, MdLocalOffer } from "react-icons/md";
import { apiFetch, apiJson } from "../lib/api";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [savedAddress, setSavedAddress] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await apiJson("/api/auth/me");
        const user = data.user;
        setIsLoggedIn(true);
        setSavedAddress(user.savedAddress || null);
        setWishlistCount(user.wishlistCount || 0);
        setCartCount(user.cartCount || 0);
      } catch (error) {
        setIsLoggedIn(false);
        setSavedAddress(null);
        setWishlistCount(0);
        setCartCount(0);
      }
    };

    fetchSession();

    window.addEventListener("authChange", fetchSession);
    window.addEventListener("wishlistChange", fetchSession);
    window.addEventListener("cartChange", fetchSession);
    window.addEventListener("addressChange", fetchSession);

    return () => {
      window.removeEventListener("authChange", fetchSession);
      window.removeEventListener("wishlistChange", fetchSession);
      window.removeEventListener("cartChange", fetchSession);
      window.removeEventListener("addressChange", fetchSession);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.log(error);
    }

    setIsLoggedIn(false);
    setCartCount(0);
    setWishlistCount(0);
    setSavedAddress(null);
    setShowDropdown(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center px-10 py-4 shadow-md bg-white sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 group">
        <FaLeaf className="text-green-700 text-xl transition group-hover:rotate-12" />

        <div className="flex flex-col leading-none">
          <span className="text-2xl font-extrabold text-green-900">
            Mithila Makhana
          </span>
          <span className="text-[11px] tracking-[0.25em] text-[#a08460] uppercase">
            From Bihar&apos;s farms to your home
          </span>
        </div>
      </Link>

      <div className="flex space-x-8 text-gray-700 font-medium">
        <Link to="/" className="hover:text-green-700">
          Home
        </Link>
        <Link to="/shop" className="hover:text-green-700">
          Shop
        </Link>
        <Link to="/about" className="hover:text-green-700">
          About
        </Link>
        <Link to="/cart" className="relative hover:text-green-700">
          Cart
          {cartCount > 0 && (
            <span className="absolute -right-5 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-700 px-1 text-xs text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {isLoggedIn ? (
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl shadow hover:bg-green-800 transition"
          >
            <FaUser className="text-white" />
            <span>Profile</span>
          </button>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
            >
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-gray-800">My Account</p>
                <p className="text-sm text-gray-500">Welcome back</p>
              </div>

              <div className="py-2 text-sm">
                <Link to="/profile"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
                >
                  <FaUser className="text-gray-600" />
                  <span>Edit Profile</span>
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
                >
                  <FaBox className="text-gray-600" />
                  <span>Orders</span>
                </Link>

                <Link
                  to="/address"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
                >
                  <FaMapMarkerAlt className="text-gray-600" />
                  <span>Address</span>
                  {savedAddress && (
                    <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      Saved
                    </span>
                  )}
                </Link>

                {savedAddress && (
                  <p className="mx-4 mb-2 -mt-1 truncate rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                    {savedAddress.flat}, {savedAddress.locality}
                  </p>
                )}

                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
                >
                  <FaHeart className="text-gray-600" />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="ml-auto rounded-full bg-green-700 px-2 py-0.5 text-xs text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
                >
                  <FaShoppingCart className="text-gray-600" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="ml-auto rounded-full bg-green-700 px-2 py-0.5 text-xs text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/coupons"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
                >
                  <MdLocalOffer className="text-gray-600" />
                  <span>Coupons</span>
                </Link>

                <Link
                  to="/help"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
                >
                  <MdHelpOutline className="text-gray-600" />
                  <span>Help Center</span>
                </Link>
              </div>

              <div className="border-t mt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 transition"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login">
          <button className="bg-green-700 text-white px-5 py-2 rounded-lg">
            Login
          </button>
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
