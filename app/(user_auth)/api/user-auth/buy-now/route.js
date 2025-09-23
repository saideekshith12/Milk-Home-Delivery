import AddToCart from '@/model/add-to-cart';
import { NextResponse } from 'next/server';
import Databaseconnection from '@/db/db';
import BuyNow from '@/model/add-to-cart-buynow';
import MilkEntry from '@/model/milk-entry';
import { getToken } from 'next-auth/jwt';

export async function POST(req) {
    const { milkid, name, mobile , address } = await req.json();
    try {
        const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET })
        if(!token){
            return NextResponse.json({error:"Please login"}, {status:400})
        }
        await Databaseconnection();
        const allitems = await AddToCart.find({user_id: token.sub});
        if(!allitems || allitems.length === 0){
            return NextResponse.json({error: "Cart is empty"}, {status: 400});
        }
        const milkdetails = await MilkEntry.findById(milkid);
        if(!milkdetails){
            return NextResponse.json({error: "Milk details not found"}, {status: 404});
        }

        const price = milkdetails.price
        const total = allitems.reduce((total, item) => total + item.total_price, 0);
        const quantity = allitems.reduce((total, item) => total + item.quantity_selected, 0);
        const buyNow = await BuyNow.create({userid:token.sub, milkid, name, mobile, address ,quantity:quantity,
            full_amount:total,
            price:price,
            date: new Date().toISOString().split('T')[0]
        });
        await AddToCart.deleteMany({user_id: token.sub});
        return NextResponse.json({message: "Order placed successfully", delivery: "Your order will delivery tomarrow morning by 6am", data: buyNow}, {status: 200});
         

      
    } catch (error) {
        return NextResponse.json({error: "Something went wrong", details: error.message}, {status: 500});
    }
}