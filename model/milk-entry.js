import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MilkEntrySchema = new mongoose.Schema({
    quantity: {
      type: Number,
      required: true  
    },
    price:{
        type: Number,
        required: true
    },
    today_total_litres:{
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: () => new Date().toISOString().split("T")[0] 
    },
    
    day: {
        type: String,
        default: () => new Date().toLocaleDateString("en-US", { weekday: "long" }) // "Friday"
  
    }    

},
{
    timestamps: true
}
);


const MilkEntry = mongoose.models.MilkEntry || mongoose.model("MilkEntry", MilkEntrySchema);

export default MilkEntry;