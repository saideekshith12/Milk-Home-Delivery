"use client";

import React, { useState } from "react";
import Link from "next/link";


export default function Button() {
  const [open, setOpen] = useState(false); // state to control modal
  const hour = new Date().getHours();
  const isDisabled = hour >= 0 && hour < 6;

  return (
    <div>
      {/* Open modal when clicked */}
      <Link href={"/user/add-to-cart"}>
            <button
        disabled={isDisabled}
        style={{ background: isDisabled ? "gray" : "green",
          color: "white",
          marginTop: "20px",
          padding: "10px 20px",
          border: "2px solid ",
          borderRadius: "10px",
          cursor: isDisabled ? "not-allowed" : "pointer", }}
      >
        Add to cart
      </button>
      
      </Link>


      <br />

      {/* Disabled button based on time */}
      <Link href={"/user/buy/now"}>
      <button
        disabled={isDisabled}
        style={{
          background: isDisabled ? "gray" : "green",
          color: "white",
          marginTop: "20px",
          padding: "10px 20px",
          border: "2px solid ",
          borderRadius: "10px",
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
      >
        {isDisabled ? "Unavailable (12AM – 6AM)" : "Buy Now"}
      </button>
      </Link>
      


    </div>
  );
}
