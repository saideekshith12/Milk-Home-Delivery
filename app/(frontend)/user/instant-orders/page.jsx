"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function InstantOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordereddata, setOrderedData] = useState([]);

  const handleOrder = async () => {
    try {
      const response = await axios.get("http://localhost:3000/orders");
      const data = response.data;
      setOrderedData(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storage = localStorage.getItem("orders");
    if (storage) {
      setOrders(JSON.parse(storage));
      setLoading(false);
    }
    handleOrder();
  }, []);

  useEffect(() => {
    if (orders.length === 0) {
      setError("No orders found");
    } else {
      setError(null);
    }
  }, [orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-green-700 mb-8 text-center">
          📦 My Orders
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.length === 0 && ordereddata.length === 0 && (
            <p className="text-gray-600 text-center col-span-full">
              No orders found ☹️
            </p>
          )}

          {/* Local Storage Orders */}
          {orders.map((order, index) => (
            <div
              key={index}
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
                🥛 Quantity: {order.quantity_selected} ml
              </p>
              <p className="text-gray-700">👤 {order.name}</p>
              <p className="text-gray-600">
                📍 {order.address?.area}, {order.address?.colony},{" "}
                {order.address?.city}, {order.address?.state} -{" "}
                {order.address?.pincode}
              </p>
              <p className="text-green-700 font-medium">
                💰 Price per 500ml: ₹{order.price}
              </p>
              <p className="text-green-800 font-bold">
                💵 Total: ₹{order.total_price}
              </p>
              <p className="text-gray-600 text-sm">
                📅 {order.date} ({order.day})
              </p>
            </div>
          ))}

          {/* API Orders */}
          {ordereddata.map((order, index) => (
            <div
              key={index}
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
                🥛 Quantity: {order.quantity} ml
              </p>
              <p className="text-gray-700">👤 {order.name}</p>
              <p className="text-gray-600">
                📍 {order.address?.area}, {order.address?.colony},{" "}
                {order.address?.city}, {order.address?.state} -{" "}
                {order.address?.pincode}
              </p>
              <p className="text-green-700 font-medium">
                💰 Price per 500ml: ₹{order.price}
              </p>
              <p className="text-green-800 font-bold">
                💵 Total: ₹{order.full_amount}
              </p>
              <p className="text-gray-600 text-sm">
                📅 {order.date} ({order.day})
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
