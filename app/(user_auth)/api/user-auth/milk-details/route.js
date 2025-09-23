import Databaseconnection from "@/db/db";
import MilkEntry from "@/model/milk-entry";
import { NextResponse } from "next/server";



export async function GET() {
    try {
        await Databaseconnection();
        const date1 = new Date().toISOString().split("T")[0]
        const milkdetails = await MilkEntry.find({date:date1});
        return NextResponse.json({ milkdetails });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}