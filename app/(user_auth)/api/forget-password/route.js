import Databaseconnection from "@/db/db";
import User from "@/model/user_signup";
import { NextResponse } from "next/server";
import sendEmail from "@/utility/email";

export  async function POST(req){
    const {email} = await req.json();
    if(!email || !email.endsWith("@gmail.com")){
        return NextResponse.json({error: "Invalid email"}, {status: 400});
    }
    
    try {
        await Databaseconnection()
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 400});
        }
        const resetToken = Math.floor(100000 + Math.random() * 900000); 
        const resetTokenExpiry = new Date(Date.now() + 3 * 1000 * 60); 
    
        user.forget_password_token = resetToken;
        user.forget_password_token_expiry = resetTokenExpiry;
        await user.save();
        try {
            await sendEmail({
                  to: email,
                  subject: "Verify your email address",
                  html: `
                    <h2>Hello ${user.name},</h2>
                    <p>Thank you for registering. Your verification code is:</p>
                    <h1 style="color:#2e6da4">${resetToken}</h1>
                     <p>Your Otp will expire in 3 minutes</p>
                     <h1 style="color:#2e6da4">${resetTokenExpiry}</h1>
                  `,
                });
            
                        return NextResponse.json({message: "Otp is sent to your email"}, {status: 201});
                    } 
            
         catch (error) {
            return NextResponse.json({error: "Something went wrong , Email could not be sent , Try again"}, {status: 500});
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}