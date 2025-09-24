"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      localStorage.setItem("userEmail", "true");
      router.push("/");
    }
  };

  // 🔄 Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <p>Loading...</p>
      </div>
    );
  }

  // ✅ If logged in
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white px-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-green-700 mb-4">
            Welcome, {session.user?.email}
          </h1>
          <button
            onClick={() => signOut()}
            className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ❌ If not logged in
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
          User Login
        </h1>

        {/* Google Sign In */}
        <button
          onClick={() => signIn("google")}
          className="w-full py-2.5 mb-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition"
        >
          Sign in with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Email/Password Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
