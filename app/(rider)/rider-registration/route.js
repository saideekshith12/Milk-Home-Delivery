import Databaseconnection from "@/db/db";
import Rider from "@/model/rider-registration";
import { NextResponse } from "next/server";


export async function POST(req){
    const {name , email , password} = await req.json();
    if(!name || !email || !password){
        return NextResponse.json({error: "All fields are required"}, {status: 400});
    }
    if(email.endsWith("@gmail.com") === false){
        return NextResponse.json({error: "Invalid email , email should end with @gmail.com"}, {status: 400});
    }
    if(password.length < 6){
        return NextResponse.json({error: "Password must be at least 6 characters"}, {status: 400});
    }
    try{
        await Databaseconnection();
        const existinguser = await Rider.findOne({email});
        if(existinguser){
            return NextResponse.json({error: "Rider already exists"}, {status: 400});
        }
        const rider = await Rider.create({name , email , password});
        return NextResponse.json({message: "Rider registered successfully" , data : rider}, {status: 200});
    }
    catch(error){
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }

}