import { NextResponse } from "next/server";
import BuyNow from "@/model/add-to-cart-buynow";
import Databaseconnection from "@/db/db";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  try {
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if(!token){
      return NextResponse.json({ message:"" }, { status: 200 });
    }

    await Databaseconnection();

    const orders = await BuyNow.find({ userid: token.sub });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 }); 
    }

    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
