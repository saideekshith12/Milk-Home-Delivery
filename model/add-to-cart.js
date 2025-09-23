import mongoose from "mongoose";

const AddToCartSchema = new mongoose.Schema(
  {
    milkEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MilkEntry",
      required: true,
    },
    quantity_selected: {
      type: Number,
      required: true,
    },
    price: {
      type: Number, 
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
      default: new Date().toISOString().split("T")[0],
    },
  },
  {
    timestamps: true, 
  }
);

delete mongoose.models.AddToCart;
const AddToCart =
  mongoose.models.AddToCart || mongoose.model("AddToCart", AddToCartSchema);

export default AddToCart;
