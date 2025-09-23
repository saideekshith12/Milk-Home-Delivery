import mongoose from "mongoose";
import Admin from "@/model/admin-model.js";
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

    const admin = await Admin.findOne({ verification_token: token, email });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 400 });
    }

    // Check if token expired
    const now = new Date();
    if (admin.token_expiry && admin.token_expiry < now) {
      await User.deleteOne({ email: admin.email });
      return NextResponse.json({ error: "OTP expired, please signup again" }, { status: 400 });
    }

    // Mark as verified
    admin.is_verified = true;
    await admin.save();

    return NextResponse.json({ message: "Admin verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
