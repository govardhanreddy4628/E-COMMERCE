// server/controllers/paymentController.js

import { razorpayInstance } from "../index.js";
import crypto from "crypto";
import { Request, Response } from "express";
import orderModel from "../models/orderModel.js";

// Create Razorpay order and save local order
export const createOrder = async (req:Request, res:Response) => {
  try {
    const { items, amount } = req.body;
    if (!items || !amount)
      return res.status(400).json({ message: "Items and amount required" });

    // Razorpay expects amount in smallest currency unit
    const options = {
        amount: amount, // e.g. for ₹100 -> 10000
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        payment_capture: 1,   //auto-capture
    }
    const rzpOrder = await razorpayInstance.orders.create({ ...options });

    const order = await orderModel.create({
      items,
      amount,
      currency: "INR",
      status: "CREATED",
      payment: { razorpay_order_id: rzpOrder.id },
    });

    res.json({ orderId: order._id, razorpayOrder: rzpOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify signature after frontend returns payment details
export const verifyPayment = async (req:Request, res:Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId} = req.body;

    if (!razorpay_signature || !razorpay_payment_id || !razorpay_order_id)
      return res.status(400).json({ message: "Missing payment data" });

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const secret = process.env.RAZORPAY_API_SECRET;
    if (!secret) {
        return res.status(500).json({ message: "Payment secret not configured" });
    }
    
    // compute expected signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(body.toString());
    const expectedSignature = hmac.digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
      // Signature mismatch
      await orderModel.findByIdAndUpdate(orderId, {
        status: "FAILED",
        $set: {
          "payment.razorpay_payment_id": razorpay_payment_id,
          "payment.razorpay_signature": razorpay_signature,
        },
      });
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Signature valid -> update order
    const updated = await orderModel.findByIdAndUpdate(
      orderId,
      {
        status: "PAID",
        $set: {
          "payment.razorpay_payment_id": razorpay_payment_id,
          "payment.razorpay_signature": razorpay_signature,
          "payment.status": "captured",
        },
      },
      { new: true }
    );

    res.json({ message: "Payment verified", order: updated });
    // res.redirect(
    //   `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    // );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: webhook handler sample (recommended to verify using webhook secret)
export const razorpayWebhook = async (req:Request, res:Response) => {
  // If you use bodyParser.json(), capture the raw body separately to verify signature with webhook secret.
  // This is a placeholder; real implementation must verify signature using RAZORPAY_WEBHOOK_SECRET.
  res.status(200).json({ ok: true });
};
