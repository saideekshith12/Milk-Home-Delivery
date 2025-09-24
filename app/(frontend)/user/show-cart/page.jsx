"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";


const baseURL = process.env.NEXT_PUBLIC_API_URL;
export default function ShowCart() {
  const { data: session , status } = useSession();

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: {
      area: "",
      colony: "",
      city: "",
      state: "",
      pincode: ""
    }
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {

    if (status === "loading") return;
    if (status === "unauthenticated") {
      setError("Please login to view your cart");
      setLoading(false);
      return;
    }
  const fetchCart = async () => {
    try {
      const token = session?.user?.id;
      const response = await axios.get(`https://milk-home-delivery.vercel.app/api/user-auth/cart`); 
      const data = response.data;

      // Use 'data' key, not 'cart'
      setCart(data.data || []);

      // Calculate total from cart items
      const calculatedTotal = (data.data || []).reduce(
        (sum, item) => sum + (item.total_price || 0),
        0
      );
      setTotal(calculatedTotal);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to fetch cart"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchCart();
}, [status, session]);


  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      address: {
        ...form.address,
        [name]: value
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    setError("");
    setSuccess("");

    try {
      
      if (cart.length === 0) {
        throw new Error("Your cart is empty");
      }

      const milkid = cart[0].milkEntry || cart[0]._id;

      const response = await axios.post(`https://milk-home-delivery.vercel.app/api/user-auth/buy-now`, { 
        milkid,
        name: form.name,
        mobile: form.mobile,
        address: form.address,
      });

      setSuccess(response.data.message + " ✅ " + response.data.delivery);
      setCart([]);
      setTotal(0);
      setShowForm(false);
      setForm({ 
        name: "",
        mobile: "",
        address: {
          area: "",
          colony: "",
          city: "",
          state: "",
          pincode: ""
        }
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Something went wrong while placing order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleQuantityIncrease = async () => {
  try {
    setUpdating(true);
    setError("");
    setSuccess("");

    const response = await axios.post(
      `https://milk-home-delivery.vercel.app/api/user-auth/price-quantity-increase-add-to-cart-buynow`,
      { accept: true }
    );

    const data = response.data;

    
    const cartArray = Array.isArray(data.cart) ? data.cart : [];
    setCart(cartArray);

    
    const newTotal = cartArray.reduce(
      (sum, item) => sum + (item.total_price || 0),
      0
    );
    setTotal(newTotal);

    setSuccess(data.message || "Quantity increased successfully ✅");
  } catch (err) {
    setError(
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Failed to increase quantity"
    );
  } finally {
    setUpdating(false);
  }
};


  const handleQuantityDecrease = async () => {
  if (cart[0]?.quantity_selected <= 500) {
    setError("Quantity cannot be less than 500ml");
    return;
  }

  try {
    setUpdating(true);
    setError("");
    setSuccess("");

    const response = await axios.post(
      `https://milk-home-delivery.vercel.app/api/user-auth/price-quantity-reduce-add-to-cart-buynow`,
      { accept: true }
    );

    const data = response.data;

    
    const cartArray = Array.isArray(data.cart) ? data.cart : [];
    setCart(cartArray);

    
    const newTotal = cartArray.reduce(
      (sum, item) => sum + (item.total_price || 0),
      0
    );
    setTotal(newTotal);

    setSuccess(data.message || "Quantity decreased successfully ✅");
  } catch (err) {
    setError(
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Failed to decrease quantity"
    );
  } finally {
    setUpdating(false);
  }
};
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-800">Your Cart</h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <Image
                    src="/image/milk.jpg"
                    alt="Milk"
                    width={100}
                    height={100}
                    className="rounded-md mr-4"
                  />
                  <div>
                    <p className="font-semibold text-lg">Fresh Milk</p>
                    <p className="text-gray-600">
                      Price (per 500 ml): ₹{item.price}
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Quantity</p>
                  <div className="flex items-center justify-center space-x-3">
                    <button 
                      onClick={handleQuantityDecrease}
                      disabled={updating || item.quantity_selected <= 500}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="font-medium">{item.quantity_selected} ml</span>
                    <button 
                      onClick={handleQuantityIncrease}
                      disabled={updating}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold text-lg mt-2">₹{item.total_price}</p>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6 p-4 border-t-2 font-bold text-xl bg-white rounded-lg">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Proceed to Checkout
              </button>
            ) : (
              <form
                onSubmit={handleBuyNow}
                className="mt-6 p-6 border rounded-lg shadow bg-white space-y-4"
              >
                <h2 className="text-xl font-bold mb-4 text-gray-800">Delivery Details</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      required
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleFormChange}
                      required
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Area/Locality *</label>
                  <input
                    type="text"
                    name="area"
                    value={form.address.area}
                    onChange={handleAddressChange}
                    required
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your area or locality"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Colony/Society *</label>
                  <input
                    type="text"
                    name="colony"
                    value={form.address.colony}
                    onChange={handleAddressChange}
                    required
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your colony or society name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={form.address.city}
                      onChange={handleAddressChange}
                      required
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={form.address.state}
                      onChange={handleAddressChange}
                      required
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your state"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="number"
                    name="pincode"
                    value={form.address.pincode}
                    onChange={handleAddressChange}
                    required
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter pincode"
                  />
                </div>

                <button
                  type="submit"
                  disabled={placingOrder}
                  className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {placingOrder ? "Placing Order..." : "Confirm Order"}
                </button>
              </form>
            )}
          </div>
        )}

  
        {cart.length > 0 && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Delivery Information</h3>
            <p className="text-blue-700 text-sm">
              Your order will be delivered tomorrow morning by 6 AM. Please ensure someone is available to receive the delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}