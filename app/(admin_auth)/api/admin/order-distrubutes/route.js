import Databaseconnection from "@/db/db";
import InstantBuyNow from "@/model/instant-buy-now";
import Rider from "@/model/rider-registration";
import OrderDistribution from "@/model/order-distrubution";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await Databaseconnection();

    const { accept } = await req.json();

    if (!accept) {
      return NextResponse.json(
        { error: "Please set accept=true to distribute today's orders" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    const orders = await InstantBuyNow.find({ date: today });
    const riders = await Rider.find();

    if (orders.length === 0) {
      return NextResponse.json(
        { message: "No orders to distribute for today" },
        { status: 200 }
      );
    }

    if (riders.length === 0) {
      return NextResponse.json(
        { error: "No riders found" },
        { status: 404 }
      );
    }

    const totalOrders = orders.length;
    const totalRiders = riders.length;
    const avgOrdersPerRider = Math.ceil(totalOrders / totalRiders);

    // Round-robin distribution
    for (let i = 0; i < totalOrders; i++) {
      const riderIndex = i % totalRiders;
      const rider = riders[riderIndex];

      orders[i].rider_id = rider._id;
      orders[i].rider_name = rider.name;
      await orders[i].save();
    }

    const updatedOrders = await InstantBuyNow.find({ date: today }).populate("rider_id", "name mobile");

    const riderView = riders.map((rider) => {
      const riderOrders = updatedOrders.filter(
        (order) =>
          order.rider_id &&
          order.rider_id._id.toString() === rider._id.toString()
      );
      return {
        rider: {
          _id: rider._id,
          name: rider.name,
          mobile: rider.mobile,
        },
        orders: riderOrders,
      };
    });

    // ✅ Store distribution in preferred simple format
    await OrderDistribution.create({
      date: today,
      totalOrders,
      totalRiders,
      avgOrdersPerRider,
      userView: updatedOrders.map(order => ({
        order_id: order._id,
        name: order.name,
        mobile: order.mobile,
        rider_id: order.rider_id?._id,
        rider_name: order.rider_name,
      })),
      riderView: riderView.map(r => ({
        rider_id: r.rider._id,
        name: r.rider.name,
        mobile: r.rider.mobile,
        orders: r.orders.map(o => ({
          order_id: o._id,
          name: o.name,
          mobile: o.mobile,
        })),
      })),
    });

    return NextResponse.json(
      {
        message: "Today's orders distributed successfully",
        totalOrders,
        totalRiders,
        avgOrdersPerRider,
        userView: updatedOrders,
        riderView,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error distributing orders:", error.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
