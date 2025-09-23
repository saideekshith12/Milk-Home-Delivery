"use client"
import Link from "next/link";

export default function SignUpButton() {
    return (
        <Link href="/user/signup">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign Up
        </button>
        </Link>
        
    );
}