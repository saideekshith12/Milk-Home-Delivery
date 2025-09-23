import mongoose from "mongoose";

const BuyNowSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    milkid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MilkEntry",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { 
        type: Number,
        required: true
       },
      full_amount: { type: Number, required: true },
      date: {
        type: String,
        required: true,
        default: new Date().toISOString().split('T')[0],
      },
      name:{
        type: String,
        required: true
      },
      mobile:{
        type: String,
        required: true
      },
      address:{
        area: { type: String, required: true },
        colony: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: Number, required: true },
      },
      rider_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rider",
      },
      rider_name: String,
      day: {
        type: String,
        required: true,
        default: new Date().toLocaleDateString("en-US", { weekday: "long" }),
      },

},
{
    timestamps: true
})
delete mongoose.models.BuyNow;
const BuyNow = mongoose.models.BuyNow || mongoose.model("BuyNow", BuyNowSchema);
export default BuyNow