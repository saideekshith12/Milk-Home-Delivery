import Databaseconnection from "@/db/db";
import InstantBuyNow from "@/model/instant-buy-now"
import MilkEntry from "@/model/milk-entry";
import Rider from "@/model/rider-registration";
import { NextResponse } from "next/server";



export async function POST(req) {
    const {milkid , quantity_selected , address, name , mobile } = await req.json();
    if(!milkid || !quantity_selected || !address){
        return NextResponse.json({error: "All fields are required"}, {status: 400});
    }
    try {
        await Databaseconnection()
        const milkdetails = await MilkEntry.findById(milkid);
        if(!milkdetails){
            return NextResponse.json({error: "Milk details not found"}, {status: 404});
        }
        const price = milkdetails.price;
        const calculate = quantity_selected / 500;
        const total_price = calculate * price;
        const instantBuyNow = await InstantBuyNow.create({milkid , quantity_selected , price , total_price , address:{area: address.area,
        colony: address.colony,
        city: address.city,
        state: address.state,
        pincode: address.pincode} , name ,  mobile});
        return NextResponse.json(
            {message : "Order placed successfully" , delivery : "Your order will delivery tomarrow morning by 6am"
                , payment : "Your payment will be done by cash on delivery", 
                data : instantBuyNow
            },
            {status : 200}
        )
    } catch (error) {
        console.error("Error fetching milk details:", error.message);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}//68bd886f3c3fc829308ab199// --rider id