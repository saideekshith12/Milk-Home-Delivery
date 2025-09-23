import AddToCart from "@/model/add-to-cart";
import { NextResponse } from "next/server";
import Databaseconnection from "@/db/db";
import { getToken } from "next-auth/jwt";

export async function POST(req){
    const {accept} = await req.json()
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
     if (!token) {
    return NextResponse.json({ error: "Login is required", cart: "Sorry Cart is empty" }, { status: 400 });
  }
    const userid = token.sub
    if(!userid){
        return NextResponse.json({error: "Login is required", cart:"Sorry Cart is empty"}, {status: 400});
    }
    if(!accept){
        return NextResponse.json({error: "Accept is required", cart:"Sorry Cart is empty"}, {status: 400});
    }

try {
    await Databaseconnection();
        const cart = await AddToCart.findOne({user_id: userid});
        if(!cart){
            return NextResponse.json({error: "Cart is empty", cart:"Add items to cart"}, {status: 400});
        }
        const quantity = cart.quantity_selected;
        const quantity_updated = quantity - 500;
        if(quantity_updated < 500){
            return NextResponse.json({error: "Quantity cannot be less than 500ml"}, {status: 400});
        }
        const upadated_calculate = quantity_updated / 500;
        let total_amount = cart.total_price;
        const price = cart.price;
        const total_updated = upadated_calculate * price;
        total_amount = total_updated
        const update = await AddToCart.updateOne({user_id: userid},{$set: {quantity_selected: quantity_updated , total_price: total_amount}});
        const cart_items = await AddToCart.find({user_id: userid});
        return NextResponse.json({message: "Quantity updated successfully", data: update, cart: cart_items}, {status: 200});
} catch (error) {
    return NextResponse.json({error: "Something went wrong" , data: error}, {status: 500});
}
    
}
/*{
 "userid":"68af42ed26153b83f10e3ec6",
 "accept":true
 "milkid":68c265812bb6d353fc283be6
}*/