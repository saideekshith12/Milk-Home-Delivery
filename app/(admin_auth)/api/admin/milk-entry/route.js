import Databaseconnection from "@/db/db";
import { NextResponse } from "next/server";
import MilkEntry from "@/model/milk-entry";

export async function POST(req){
    const {price , today_total_litres , location, quantity} = await req.json();
    if(!price || !today_total_litres || !location || !quantity){
        return NextResponse.json({error: "Enter all fields"}, {status: 400});
    }
    try{
        await Databaseconnection()
        const milkEntry = await MilkEntry.create({price , today_total_litres , location , quantity});
        return NextResponse.json({message: "Milk entry added successfully" , data: milkEntry}, {status: 200}
        );
    }
    catch(error){
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }

}