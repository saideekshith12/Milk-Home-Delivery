"use client";

import React, { useEffect, useState } from "react";
import useMilkDetails from "@/store/milk_details";
import axios from "axios";
import Image from "next/image";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function BuyNow() {
  const { milk, loading, error, fetchMilk } = useMilkDetails();

  const [selectedMilkId, setSelectedMilkId] = useState(null);

  // Form fields
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [area, setArea] = useState("");
  const [colony, setColony] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    fetchMilk();
  }, [fetchMilk]);

  const handleBuyNow = (id) => {
    setSelectedMilkId(id);
    setResponse(null);
    setErrors(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quantity || !name || !mobile || !area || !colony || !city || !state || !pincode) {
      setErrors("⚠️ Please fill all fields before proceeding.");
      return;
    }

    setErrors(null);
    setSubmitting(true);

    try {
      const res = await axios.post(`${baseURL}/api/user-auth/instant-buy-now`, {
        milkid: selectedMilkId,
        quantity_selected: quantity,
        name,
        mobile,
        address: { area, colony, city, state, pincode },
      });

      setResponse({
        message: res.data.message,
        delivery: res.data.delivery,
        payment: res.data.payment,
        order: res.data.data,
      });

      // Store in localStorage
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      existingOrders.push(res.data.data);
      localStorage.setItem("orders", JSON.stringify(existingOrders));
    } catch (err) {
      setResponse({ error: err.response?.data?.error || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-green-700 mb-8 text-center">
          🥛 Buy Fresh Milk
        </h1>

        {/* Milk list */}
        {loading && <p className="text-gray-500 text-center">Loading milk details...</p>}
        {error && <p className="text-red-500 text-center">Failed to load: {error}</p>}
        {!loading && !error && milk.length === 0 && (
          <p className="text-gray-600 text-center">Sorry, today milk is not available ☹️</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {!loading &&
            !error &&
            milk.map((milkItem) => (
              <div
                key={milkItem._id}
                className="p-5 border rounded-2xl shadow-lg bg-white transition hover:scale-[1.02]"
              >
                <div className="flex justify-center mb-4">
                  <Image
                    src="/image/milk.jpg"
                    alt="Milk"
                    width={180}
                    height={180}
                    className="rounded-xl shadow"
                  />
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  Quantity: {milkItem.quantity} ml
                </p>
                <p className="text-green-700 font-bold">₹ {milkItem.price}</p>
                <button
                  onClick={() => handleBuyNow(milkItem._id)}
                  className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Select This
                </button>
              </div>
            ))}
        </div>

        {/* Checkout form */}
        {selectedMilkId && (
          <div className="mt-10 p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-green-700">🧾 Checkout</h2>

            {errors && <p className="text-red-500 mb-4">{errors}</p>}

            {response ? (
              <div>
                {response.error ? (
                  <p className="text-red-600 font-medium">{response.error}</p>
                ) : (
                  <>
                    <div className="p-4 rounded-lg bg-green-100 border border-green-400 mb-4">
                      <p className="font-semibold">{response.message}</p>
                      <p>{response.delivery}</p>
                      <p>{response.payment}</p>
                    </div>

                    <div className="p-4 bg-gray-50 border rounded-xl shadow-md">
                      <h3 className="text-lg font-bold mb-3">Order Details</h3>
                      <p><strong>Quantity:</strong> {response.order.quantity_selected} ml</p>
                      <p><strong>Name:</strong> {response.order.name}</p>
                      <p><strong>Mobile:</strong> {response.order.mobile}</p>
                      <p>
                        <strong>Address:</strong> {response.order.address?.area},{" "}
                        {response.order.address?.colony}, {response.order.address?.city},{" "}
                        {response.order.address?.state} - {response.order.address?.pincode}
                      </p>
                      <p><strong>Price per 500ml:</strong> ₹{response.order.price}</p>
                      <p><strong>Total Price:</strong> ₹{response.order.total_price}</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Quantity dropdown */}
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400"
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

                {/* User details */}
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400" />
                <input type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400" />

                {/* Address fields */}
                <input type="text" placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)} required className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400" />
                <input type="text" placeholder="Colony" value={colony} onChange={(e) => setColony(e.target.value)} required className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400" />
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400" />
                <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400" />
                <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400" />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


