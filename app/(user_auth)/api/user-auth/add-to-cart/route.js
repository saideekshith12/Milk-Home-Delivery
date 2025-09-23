import Databaseconnection from "@/db/db";
import MilkEntry from "@/model/milk-entry";
import { NextResponse } from "next/server";
import AddToCart from "@/model/add-to-cart";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Please login to add the milk in the cart" }, { status: 401 });
    }
    await Databaseconnection();

    const user_id = token.id;

    const { milkEntryId, quantity_selected } = await req.json();

    if (!milkEntryId || !quantity_selected) {
      return NextResponse.json(
        { error: "MilkEntryId, Quantity, are required" },
        { status: 400 }
      );
    }

    if (quantity_selected < 500) {
      return NextResponse.json(
        { error: "Minimum quantity is 500ml" },
        { status: 400 }
      );
    }

    const milkEntry = await MilkEntry.findById(milkEntryId);
    if (!milkEntry) {
      return NextResponse.json(
        { error: "Milk entry not found" },
        { status: 404 }
      );
    }


    const cart = await AddToCart.findOne({ milkEntry: milkEntryId, user_id });
    if (cart) {
      return NextResponse.json(
        { error: "Milk entry already added to cart", message: "Please update the quantity instead" },
        { status: 400 }
      );
    }

    const price = milkEntry.price;
    const calculate = quantity_selected / 500;
    const total_price = calculate * price;

    const addToCart = await AddToCart.create({
      milkEntry: milkEntry._id,
      quantity_selected,
      price,
      total_price,
      user_id,
    });

    return NextResponse.json(
      { message: "Added to cart successfully", data: addToCart },
      { status: 200 }
    );
  } catch (error) {
    console.log("AddToCart POST error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

