import Databaseconnection from "@/db/db";
import User from "@/model/user_signup";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {email , password} = await req.json();
    if(!email || !password){
        return NextResponse.json({error: "All fields are required"}, {status: 400});
    }
    if(email.endsWith("@gmail.com") === false){
        return NextResponse.json({error: "Invalid email , email should end with @gmail.com"}, {status: 400});
    }
    if(password.length < 6){
        return NextResponse.json({error: "Password must be at least 6 characters"}, {status: 400});
    }
    try {
        await Databaseconnection()
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 400});
        }
        try {
            user.password = password;
            await user.save();
            return NextResponse.json({message: "Password reset successfully"}, {status: 200});
        } catch (error) {
            return NextResponse.json({error: "Error resetting password"}, {status: 500});
        }
    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}