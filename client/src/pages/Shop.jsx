import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaLeaf, FaPepperHot, FaRegHeart } from "react-icons/fa";
import { MdOutlineSort } from "react-icons/md";
import { apiJson } from "../lib/api";

const productTypes = ["all", "flavored", "roasted", "raw"];
const flavorOptions = [
  "all",
  "Masala",
  "Cheese & Herbs",
  "Peri Peri",
  "Cream & Onion",
  "Caramel",
];
const sutaOptions = ["all", "4 Suta", "5 Suta", "6 Suta", "7 Suta"];

const typeCopy = {
  all: "Browse the complete makhana range from raw and roasted grades to flavored packs.",
  flavored:
    "Explore seasoned makhana like Masala, Cheese & Herbs, Peri Peri, Cream & Onion, and Caramel.",
  roasted:
    "Choose roasted makhana by grade, from 4 suta to 7 suta, for daily ready-to-eat snacking.",
  raw: "Choose raw phool makhana by grade for home roasting, fasting meals, and cooking.",
};

function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [productType, setProductType] = useState("all");
  const [selectedFlavor, setSelectedFlavor] = useState("all");
  const [selectedSuta, setSelectedSuta] = useState("all");
  const [sortOrder, setSortOrder] = useState("featured");
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const data = await apiJson("/api/auth/wishlist");
      setWishlistIds(data.items.map((item) => item.id));
    } catch (error) {
      setWishlistIds([]);
    }
  };

  const loadProducts = async ({
    type = productType,
    flavor = selectedFlavor,
    suta = selectedSuta,
    sort = sortOrder,
  } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (type !== "all") params.set("type", type);
      if (type === "flavored" && flavor !== "all") params.set("flavor", flavor);
      if ((type === "raw" || type === "roasted") && suta !== "all") {
        params.set("suta", suta);
      }
      if (sort !== "featured") params.set("sort", sort);

      const query = params.toString();
      const data = await apiJson(`/products${query ? `?${query}` : ""}`);
      setProducts(data);
    } catch (error) {
      console.log(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [productType, selectedFlavor, selectedSuta, sortOrder]);

  useEffect(() => {
    fetchWishlist();
    window.addEventListener("wishlistChange", fetchWishlist);

    return () => {
      window.removeEventListener("wishlistChange", fetchWishlist);
    };
  }, []);

  const addToCart = async (product) => {
    try {
      await apiJson("/api/cart/add", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      window.dispatchEvent(new Event("cartChange"));
    } catch (error) {
      // alert(error.message);
      if (error.message === "No token" || error.message === "Invalid token") {
        navigate("/login");
      }
    }
  };

  const toggleWishlist = async (product) => {
    try {
      await apiJson("/api/auth/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
      });

      await fetchWishlist();
      window.dispatchEvent(new Event("wishlistChange"));
    } catch (error) {
      alert(error.message);
      if (error.message === "No token" || error.message === "Invalid token") {
        navigate("/login");
      }
    }
  };

  const handleTypeChange = (type) => {
    setProductType(type);
    setSelectedFlavor("all");
    setSelectedSuta("all");
  };

  const handleFlavorChange = (flavor) => {
    setSelectedFlavor(flavor);

    if (flavor !== "all") {
      setProductType("flavored");
      setSelectedSuta("all");
    }
  };

  const handleSutaChange = (suta) => {
    setSelectedSuta(suta);

    if (productType !== "raw" && productType !== "roasted") {
      setProductType("raw");
    }
  };

  const showSutaFilter = productType === "raw" || productType === "roasted";

  return (
    <div className="bg-[#f6efe4] px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <section className="mt-4 overflow-hidden rounded-[2rem] bg-[#1f4d3a] text-white shadow-2xl">
          <div className="grid gap-10 px-6 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-10 lg:px-14">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] text-white/90">
                <FaLeaf className="text-[#d8ef9a]" />
                GI-tagged Mithila Makhana
              </p>
              <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-5xl">
                Shop premium makhana by type, flavor, and suta grade.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
                Explore a premium makhana collection with raw pantry staples,
                roasted ready-to-eat favorites, and bold flavored snacking
                options for every mood.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#f5d28d] px-4 py-2 text-sm font-semibold text-[#493018]">
                  Raw 4 to 7 suta
                </span>
                <span className="rounded-full bg-[#d8ef9a] px-4 py-2 text-sm font-semibold text-[#23432e]">
                  Roasted 4 to 7 suta
                </span>
                <span className="rounded-full bg-[#f8b57e] px-4 py-2 text-sm font-semibold text-[#5a2e15]">
                  5 flavored options
                </span>
              </div>
            </div>

            <div className="grid gap-4 self-end sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/70">Types of makhana</p>
                <p className="mt-2 text-3xl font-bold">3</p>
                <p className="mt-2 text-sm text-white/75">Raw, roasted, flavored</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/70">Suta grades</p>
                <p className="mt-2 text-3xl font-bold">4</p>
                <p className="mt-2 text-sm text-white/75">4, 5, 6, 7 suta</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/70">Flavored variants</p>
                <p className="mt-2 text-3xl font-bold">5</p>
                <p className="mt-2 text-sm text-white/75">Masala to caramel</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[2rem] border border-[#eadfcf] bg-[#fffaf2] p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8e734f]">
                  Curate your shelf
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#2a241d]">
                  Filter shop
                </h2>
              </div>
              <div className="rounded-full bg-[#f2e4cf] p-3 text-[#6f5330]">
                <MdOutlineSort className="text-2xl" />
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-[#7d6242]">Types Of Makhana</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {productTypes.map((type) => {
                  const active = productType === type;

                  return (
                    <button
                      key={type}
                      onClick={() => handleTypeChange(type)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                        active
                          ? "bg-[#1f4d3a] text-white shadow-md"
                          : "bg-[#f5ebdc] text-[#5d4a32] hover:bg-[#eadac3]"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm leading-6 text-[#7d6752]">
                {typeCopy[productType]}
              </p>
            </div>

            {showSutaFilter && (
              <div className="mt-8 border-t border-[#efdfca] pt-8">
                <p className="text-sm font-semibold text-[#7d6242]">Suta Grade</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {sutaOptions.map((suta) => {
                    const active = selectedSuta === suta;

                    return (
                      <button
                        key={suta}
                        onClick={() => handleSutaChange(suta)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          active
                            ? "bg-[#8d5e37] text-white shadow-md"
                            : "bg-white text-[#5d4a32] ring-1 ring-[#ead6bb] hover:bg-[#f5ebdc]"
                        }`}
                      >
                        {suta}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-sm leading-6 text-[#7d6752]">
                  Filter raw or roasted makhana by 4 suta, 5 suta, 6 suta, or 7 suta.
                </p>
              </div>
            )}

            <div className="mt-8 border-t border-[#efdfca] pt-8">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#7d6242]">
                <FaPepperHot />
                Flavored Makhana Options
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {flavorOptions.map((flavor) => {
                  const active = selectedFlavor === flavor;
                  const isDisabled = productType !== "flavored" && flavor !== "all";

                  return (
                    <button
                      key={flavor}
                      onClick={() => handleFlavorChange(flavor)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-[#c66a3d] text-white shadow-md"
                          : "bg-white text-[#5d4a32] ring-1 ring-[#ead6bb]"
                      } ${isDisabled ? "opacity-60 hover:opacity-100" : "hover:bg-[#f5ebdc]"}`}
                    >
                      {flavor}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm leading-6 text-[#7d6752]">
                Select a flavor to narrow the collection to your favorite seasoned makhana.
              </p>
            </div>

            <div className="mt-8 border-t border-[#efdfca] pt-8">
              <label
                htmlFor="price-sort"
                className="block text-sm font-semibold text-[#7d6242]"
              >
                Price sorting
              </label>
              <select
                id="price-sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-[#e7d5bc] bg-white px-4 py-3 text-[#3f3224] outline-none transition focus:border-[#1f4d3a]"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-[#eadfcf] bg-[#fffaf2] px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#a08460]">
                  Collection
                </p>
                <h2 className="mt-1 text-2xl font-bold text-[#2a241d]">
                  {products.length} products available
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[#7d6752]">
                Find the right makhana for your taste, from simple everyday crunch to festive and flavorful snack picks.
              </p>
            </div>

            {loading ? (
              <div className="rounded-[1.75rem] border border-[#eadfcf] bg-[#fffaf2] px-6 py-16 text-center text-[#6e5b47] shadow-sm">
                Loading makhana collection...
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-[#d8c0a0] bg-[#fffaf2] px-6 py-16 text-center shadow-sm">
                <h3 className="text-2xl font-bold text-[#2a241d]">
                  No makhana matched this filter
                </h3>
                <p className="mt-3 text-[#7d6752]">
                  Try another type, change the suta grade, clear the flavor filter, or switch the sort.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                  const isWishlisted = wishlistIds.includes(product.id);

                  return (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-[1.75rem] border border-[#eadfcf] bg-[#fffaf2] shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#20160d]/55 to-transparent" />
                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#5b442a]">
                            {product.type}
                          </span>
                          {product.suta && (
                            <span className="rounded-full bg-[#8d5e37] px-3 py-1 text-xs font-semibold text-white">
                              {product.suta}
                            </span>
                          )}
                          {product.flavor !== "Plain" && (
                            <span className="rounded-full bg-[#1f4d3a] px-3 py-1 text-xs font-semibold text-white">
                              {product.flavor}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-lg text-[#755b42] shadow-md transition hover:scale-105"
                        >
                          {isWishlisted ? (
                            <FaHeart className="text-[#cf4f55]" />
                          ) : (
                            <FaRegHeart />
                          )}
                        </button>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold text-[#241d16]">
                              {product.name}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-[#73604d]">
                              {product.description}
                            </p>
                          </div>
                          <div className="shrink-0 rounded-2xl bg-[#f4e0bc] px-3 py-2 text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#866847]">
                              Price
                            </p>
                            <p className="text-xl font-black text-[#2a241d]">
                              Rs. {product.price}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {(product.highlights || []).map((highlight) => (
                            <span
                              key={highlight}
                              className="rounded-full bg-[#f5ebdc] px-3 py-1 text-xs font-semibold text-[#6d563c]"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex gap-3">
                          <button
                            onClick={() => addToCart(product)}
                            className="flex-1 rounded-2xl bg-[#1f4d3a] px-4 py-3 font-semibold text-white transition hover:bg-[#17392b]"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => navigate("/cart")}
                            className="rounded-2xl border border-[#d9c1a3] px-4 py-3 font-semibold text-[#5d4a32] transition hover:bg-[#f5ebdc]"
                          >
                            View Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Shop;
