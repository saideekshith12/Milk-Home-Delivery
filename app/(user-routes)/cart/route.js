import AddToCart from "@/model/add-to-cart";
import Databaseconnection from "@/db/db";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import MilkEntry from "@/model/milk-entry";

export async function GET(req) {
    try {
        const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET})
        if(!token){
            return NextResponse.json({error:"Please login to see the items added in cart"}, {status:400})
        }
        await Databaseconnection();
        const cart = await AddToCart.find({user_id:token.sub});
        if(cart.length === 0){
            return NextResponse.json({ error: "Cart is empty" }, { status: 200 });
        }
        const today = new Date().toISOString().split("T")[0];
        if(cart[0].date !== today){
            await AddToCart.deleteMany({user_id: token.sub});
            return NextResponse.json({ error: "Yestraday Milk added to cart is expired, Please add again" }, { status: 200 });
        }
        const cart_total = cart.reduce((total, item) => total + item.total_price, 0);
        return NextResponse.json({ data: cart , total: cart_total }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" , details: error.message }, { status: 500 });
    }
}