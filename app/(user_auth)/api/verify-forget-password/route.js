import Databaseconnection from "@/db/db";
import { NextResponse } from "next/server";
import User from "@/model/user_signup";

export async function POST(req) {
    const {email, otp} = await req.json();
    if(!otp || !email){
          return NextResponse.json({error: "All fields are required"}, {status: 400});
    }
    if(otp.toString().length !== 6){
        return NextResponse.json({error: "OTP must be 6 digits"}, {status: 400});
    }
    try{
        await Databaseconnection()
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 400});
        }
        if(user.forget_password_token !== otp){
            return NextResponse.json({error: "Invalid OTP"}, {status: 400});
        }
        const now = new Date();
        if(user.forget_password_token_expiry < now){
            user.forget_password_token = "";
            user.forget_password_token_expiry = "";
            await user.save();
            return NextResponse.json({error: "OTP expired"}, {status: 400});
        }
            user.forget_password_token = "";
            user.forget_password_token_expiry = "";
            await user.save();
        return NextResponse.json({message: "OTP verified"}, {status: 200});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
    
}