import mongoose from "mongoose";

const Instantbuynow = new mongoose.Schema({
  milkid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MilkEntry",
    required: true,
  },
  quantity_selected: { type: Number, required: true },
  price: { type: Number, required: true },
  total_price: { type: Number, required: true },
  date: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  },
  day: {
    type: String,
    default: () =>
      new Date().toLocaleDateString("en-US", { weekday: "long" }),
  },
  address: {
    area: { type: String, required: true },
    colony: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
  },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
   rider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rider",
  },
  rider_name: String,

}, { timestamps: true });

delete mongoose.models.InstantBuyNow;
const InstantBuyNow = mongoose.model("InstantBuyNow", Instantbuynow);

export default InstantBuyNow;


