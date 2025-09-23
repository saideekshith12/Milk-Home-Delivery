
import Admin from "@/model/admin-model";
import sendEmail from "@/utility/email.js";

import { NextResponse } from "next/server";
import  Databaseconnection from "@/db/db.js";

export async function POST(req) {
    const { name, email, password } = await req.json();
    if(!name || !email || !password){
        return NextResponse.json({error: "All fields are required"}, {status: 400});
    }
    if(!email.includes("@") || !email.endsWith("@gmail.com")){
        return NextResponse.json({error: "Invalid email"}, {status: 400});
    }
    if(password.length < 6){
        return NextResponse.json({error: "Password must be at least 6 characters"}, {status: 400});
    }
    try {
        await Databaseconnection();
        const existinguser = await Admin.findOne({email});
        if(existinguser){
            return NextResponse.json({error: "Admin already exists"}, {status: 400});
        }

        const generate_token = Math.floor(100000 + Math.random() * 900000);
        const expiry_time = new Date(Date.now() + 3 * 1000 * 60);

        const admin = await Admin.create({
            name,
            email,
            password,
            verification_token: generate_token,
            token_expiry: expiry_time,
            isverified: false
        }) 

        const token = admin.verification_token;
        try {
            await sendEmail({
      to: email,
      subject: "Verify your email address",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for registering. Your verification code is:</p>
        <h1 style="color:#2e6da4">${token}</h1>
      `,
    });

            return NextResponse.json({message: "Otp is sent to your email"}, {status: 201});
        } catch (error) {
            console.log(error);
            return NextResponse.json({error: "Email could not be sent, Try again"}, {status: 500});
            
        }
}
catch{
    console.log(error);
    return NextResponse.json({error: "Something went wrong"}, {status: 500});

}
}
