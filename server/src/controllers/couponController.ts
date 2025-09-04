import { Request, Response } from 'express';
import Coupon, { ICoupon } from '../models/couponModel';

export const applyCoupon = async (req: Request, res: Response) => {
  try {
    const { code, userId } = req.body;

    const coupon: ICoupon | null = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon || coupon.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired coupon' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    if (
      coupon.applicableUsers.length &&
      !coupon.applicableUsers.some((id) => id.toString() === userId)
    ) {
      return res.status(403).json({ success: false, message: 'Not eligible for this coupon' });
    }

    return res.status(200).json({
      success: true,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (err) {
    console.error('Apply Coupon Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
