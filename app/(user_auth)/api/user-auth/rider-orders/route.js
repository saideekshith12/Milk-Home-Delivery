import InstantBuyNow from "@/model/instant-buy-now";
import BuyNow from "@/model/add-to-cart-buynow";
import { NextResponse } from "next/server";
import Databaseconnection from "@/db/db";

export async function POST(req){
    const {rider_id} = await req.json();
    if(!rider_id){
        return NextResponse.json({error: "Rider please login"}, {status: 400});
    }
    try {
        await Databaseconnection();
        const deliveryOrders = await InstantBuyNow.find({ rider_id });
        const buynowOrders = await BuyNow.find({ rider_id });
        const day = new Date().toISOString().split("T")[0];
        const days = new Date().toLocaleDateString("en-US", { weekday: "long" });
        const instantOrders = deliveryOrders.filter((order) => order.day === days);
        const buyOrders = buynowOrders.filter((order) => order.date === day);
        return NextResponse.json({deliveryOrders, buynowOrders, instantOrders, buyOrders}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Something went wrong" , details: error.message}, {status: 500});
    }
}