"use client";

import { useEffect } from "react";
import LoginButton from "./components/login-button/login-button";
import SignUpButton from "./components/signup-button/signup-button";
import useMilkDetails from "../store/milk_details";
import Button from "./components/Button/Button";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { milk, loading, error, fetchMilk } = useMilkDetails();
  const { data: session } = useSession();

  useEffect(() => {
    fetchMilk();
  }, [fetchMilk]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-700 tracking-wide">
          🥛 Farm Milk
        </h1>

        <div className="space-x-3">
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md transition duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <LoginButton />
              <SignUpButton />
            </>
          )}
        </div>
      </header>

      <hr className="border-gray-300 mb-6" />

      {/* Orders & Cart */}
      <div className="flex gap-4 mb-8">
        <Link href={"/user/instant-orders"}>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-xl shadow-md transition duration-200">
            📦 Orders
          </button>
        </Link>

        {session && (
          <Link href={"/user/show-cart"}>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition duration-200">
              🛒 Cart
            </button>
          </Link>
        )}
      </div>

      {/* Milk Details */}
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Milk Details</h2>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && milk.length === 0 && (
          <p className="text-gray-600">Sorry, today milk is not available.</p>
        )}

        {milk.length === 1 && (
          <div className="flex justify-center my-4">
            <Image
              src="/image/milk.jpg"
              alt="Milk"
              width={200}
              height={200}
              className="rounded-xl shadow-md"
            />
          </div>
        )}

        <ul className="space-y-3">
          {!loading &&
            !error &&
            milk.map((milkItem) => (
              <li
                key={milkItem._id}
                className="bg-green-50 p-4 rounded-xl shadow-sm text-gray-800"
              >
                <p className="font-medium">Quantity: {milkItem.quantity} ml</p>
                <p className="font-semibold text-green-700">
                  Price: ₹ {milkItem.price}
                </p>
              </li>
            ))}
        </ul>

        {!loading && milk.length === 1 && (
          <div className="mt-5">
            <Button />
          </div>
        )}
      </div>
    </div>
  );
}
