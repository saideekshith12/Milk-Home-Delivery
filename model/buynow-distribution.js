import mongoose from "mongoose";

const BuyNowDistributionSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  totalOrders: { type: Number, required: true },
  totalRiders: { type: Number, required: true },
  avgOrdersPerRider: { type: Number, required: true },
  userView: [
    {
      order_id: { type: mongoose.Schema.Types.ObjectId, ref: "BuyNow" },
      name: String,
      mobile: String,
      rider_id: { type: mongoose.Schema.Types.ObjectId, ref: "Rider" },
      rider_name: String,
    }
  ],
  riderView: [
    {
      rider_id: { type: mongoose.Schema.Types.ObjectId, ref: "Rider" },
      name: String,
      mobile: String,
      orders: [
        {
          order_id: { type: mongoose.Schema.Types.ObjectId, ref: "BuyNow" },
          name: String,
          mobile: String,
        }
      ]
    }
  ]
}, { timestamps: true });

const BuyOrderDistribution = mongoose.models.BuyOrderDistribution || mongoose.model("BuyOrderDistribution", BuyNowDistributionSchema);

export default BuyOrderDistribution;