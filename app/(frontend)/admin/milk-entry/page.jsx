"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

 const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function MilkEntry() {
 
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const storage = localStorage.getItem("adminEmail");
    if (!storage) {
      alert("Please login");
      router.push("/admin/login");
    } else {
      setCheckedAuth(true);
    }
  }, [router]);

  const [error, setError] = useState("");
  const [price, setPrice] = useState("");
  const [todayTotalLitres, setTodayTotalLitres] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEntryMilk = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!price || !todayTotalLitres || !location || !quantity) {
      setError("Please fill all the fields");
      return;
    }
    if (quantity !== "500") {
      setError("Quantity must be 500 ml");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://milk-home-delivery.vercel.app/api/admin/milk-entry`,
        {
          price,
          today_total_litres: todayTotalLitres,
          location,
          quantity,
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message);
        setPrice("");
        setTodayTotalLitres("");
        setLocation("");
        setQuantity("");
      } else {
        setError(response.data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  if (!checkedAuth) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Milk Entry
        </h1>

        {error && (
          <p className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</p>
        )}
        {message && (
          <p className="mb-4 text-green-700 bg-green-100 p-3 rounded">{message}</p>
        )}

        <form onSubmit={handleEntryMilk} className="space-y-4">
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="text"
            placeholder="Total Litres Today"
            value={todayTotalLitres}
            onChange={(e) => setTodayTotalLitres(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="text"
            placeholder="Quantity (must be 500ml)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}
