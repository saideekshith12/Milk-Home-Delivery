"use client";

import React, { useEffect, useState, useRef } from "react";
import useMilkDetails from "@/store/milk_details";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

 const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function AddToCartPage() {
  const router = useRouter();
  const { milk, loading, error, fetchMilk } = useMilkDetails();
  const alertShown = useRef(false);

  const [selectedMilkId, setSelectedMilkId] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const storage = localStorage.getItem("userEmail");
    if (!storage && !alertShown.current) {
      alertShown.current = true;
      alert("Please login");
      router.push("/user/login");
    }
    fetchMilk();
  }, [fetchMilk, router]);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!quantity || !selectedMilkId) {
      setErrors("⚠️ Please select a milk option and enter quantity");
      return;
    }

    setSubmitting(true);
    setErrors(null);

    try {
      const res = await axios.post(`https://milk-home-delivery.vercel.app/api/user-auth/add-to-cart`, {
        milkEntryId: selectedMilkId,
        quantity_selected: quantity,
      });
      setResponse(res.data);
    } catch (err) {
      setResponse({
        error: err.response?.data?.error || "Something went wrong",
        message: err.response?.data?.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-700">
            🥛 Add Milk to Cart
          </h1>
          <Link href="/user/show-cart">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition">
              🛒 View Cart
            </button>
          </Link>
        </div>

        {/* Milk Section */}
        {loading && (
          <p className="text-gray-500 text-lg font-medium">
            Loading milk details...
          </p>
        )}
        {error && (
          <p className="text-red-500 font-medium">
            ❌ Failed to load milk details: {error}
          </p>
        )}
        {!loading && !error && milk.length === 0 && (
          <p className="text-gray-600">
            Sorry, milk is not available today. ☹️
          </p>
        )}

        {/* Milk options */}
        <div className="grid md:grid-cols-2 gap-6">
          {milk.map((milkItem) => (
            <div
              key={milkItem._id}
              className={`p-5 border rounded-2xl shadow-lg bg-white transition hover:scale-[1.02] cursor-pointer ${
                selectedMilkId === milkItem._id
                  ? "border-green-500 ring-2 ring-green-300"
                  : ""
              }`}
              onClick={() => setSelectedMilkId(milkItem._id)}
            >
              {milk.length === 1 && (
                <div className="flex justify-center mb-3">
                  <Image
                    src="/image/milk.jpg"
                    alt="Milk"
                    width={180}
                    height={180}
                    className="rounded-xl shadow-md"
                  />
                </div>
              )}
              <p className="text-lg font-semibold text-gray-800">
                Quantity: {milkItem.quantity} ml
              </p>
              <p className="text-green-700 font-medium">
                Price: ₹{milkItem.price}
              </p>
              <button
                className={`mt-3 w-full px-4 py-2 rounded-xl font-semibold shadow-md transition ${
                  selectedMilkId === milkItem._id
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {selectedMilkId === milkItem._id ? "✅ Selected" : "Select"}
              </button>
            </div>
          ))}
        </div>

        {/* Response */}
        {response && (
          <div className="mt-8 p-6 border rounded-2xl bg-gray-50 shadow-md">
            {response.error ? (
              <p className="text-red-600 font-medium">
                {response.error} - {response.message}
              </p>
            ) : (
              <>
                <p className="text-green-700 font-semibold">
                  ✅ {response.message}
                </p>
                <p>Quantity: {response.data?.quantity_selected} ml</p>
                <p>Price per 500ml: ₹{response.data?.price}</p>
                <p>Total Price: ₹{response.data?.total_price}</p>
              </>
            )}
          </div>
        )}

        {/* Quantity Form */}
        {selectedMilkId && (
          <form
            onSubmit={handleAddToCart}
            className="mt-8 p-6 bg-white shadow-lg rounded-2xl space-y-5"
          >
            {errors && <p className="text-red-500">{errors}</p>}

            <h2 className="text-xl font-bold text-gray-800">
              🧮 Choose Quantity
            </h2>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Select Quantity</option>
              <option value="500">500 ml</option>
              <option value="1000">1000 ml (1 litre)</option>
              <option value="1500">1500 ml (1.5 litre)</option>
              <option value="2000">2000 ml (2 litre)</option>
              <option value="2500">2500 ml (2.5 litre)</option>
              <option value="3000">3000 ml (3 litre)</option>
              <option value="3500">3500 ml (3.5 litre)</option>
              <option value="4000">4000 ml (4 litre)</option>
              <option value="4500">4500 ml (4.5 litre)</option>
            </select>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition"
            >
              {submitting ? "⏳ Adding to Cart..." : "🛒 Add to Cart"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
