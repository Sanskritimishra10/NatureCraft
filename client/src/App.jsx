import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Benefits from "./components/Benefits";
import Story from "./components/Story";
import CrossPromo from "./components/CrossPromo";
import Footer from "./components/Footer";
import BackButton from "./components/BackButton";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import { Route, Routes } from "react-router-dom";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Wishlist from "./pages/Wishlist"
import Address from "./pages/Address";
import EditProfile from "./pages/EditProfile";

function HomePage() {
  return (
    <>
      <Hero />
      <Products />
      <Benefits />
      <Story />
      <CrossPromo />
    </>
  );
}

function App() {
  return (
    <>
      <Navbar />
      {/* <BackButton /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart/update" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/send-otp" element={<Login/>}/>
        <Route path="/verify-otp" element={<Login/>}/>
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/address" element={<Address />} />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/cart/add" element={<Products/>}/>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
