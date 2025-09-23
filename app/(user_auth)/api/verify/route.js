import mongoose from "mongoose";
import User from "@/model/user_signup.js";
import { NextResponse } from "next/server";
import Databaseconnection from "@/db/db.js";

export async function POST(req) {
  try {
    const { token, email } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    if (token.length < 6) {
      return NextResponse.json({ error: "Token must be 6 digits" }, { status: 400 });
    }

    await Databaseconnection();

    const user = await User.findOne({ verification_token: token, email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Check if token expired
    const now = new Date();
    if (user.token_expiry && user.token_expiry < now) {
      await User.deleteOne({ email: user.email });
      return NextResponse.json({ error: "OTP expired, please signup again" }, { status: 400 });
    }

    // Mark as verified
    user.is_verified = true;
    await user.save();

    return NextResponse.json({ message: "User verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
