import crypto from "crypto";
import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import { razorpay } from "../server.js";
import Payment from "../models/payment.model.js";

// getRazorpayApiKey
export const getRazorpayApiKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Razorpay API Key",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// buySubscription
export const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("Unauthorized, please login"));
    }

    if (user.role === "ADMIN") {
      return next(new AppError("Admin cannot purchase a subscription", 400));
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscribed Successfully",
      subscription_id: subscription.id,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// verifySubscription
export const verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { payment_id, signature, subscription_id } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError("Unauthorized, please login."));
    }

    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${payment_id}|${subscriptionId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return next(new AppError("Payment not verified, please try again", 500));
    }

    await Payment.create({
      payment_id,
      signature,
      subscription_id,
    });

    user.subscription.status = "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully!",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// Chancel Subscription.
export const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("Unauthorized, please login."));
    }

    if (user.role === "ADMIN") {
      return next(new AppError("Admin cannot purchese a subscription", 400));
    }

    const subscriptionId = user.subscription.id;

    const subscription = await razorpay.subscriptions.cancel(subscriptionId);

    user.subscription.status = subscription.status;

    await user.save();
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// All Payments.
export const allPayments = async (req, res, next) => {
    try {
        const { count } = req.query;

        const subscriptions = await razorpay.subscriptions.all({
            count: count || 10,
        });

        res.status(200).json({
            success: true,
            message: 'All payments',
            subscriptions
        });

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};
