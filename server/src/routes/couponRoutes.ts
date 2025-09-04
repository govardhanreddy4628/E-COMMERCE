import express from 'express';
import { applyCoupon } from '../controllers/couponController';

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
router.post('/apply', asyncHandler(applyCoupon));

export default router;





// //frontend code
// const applyCoupon = async () => {
//   const res = await axios.post('/api/coupons/apply', {
//     code: couponInput,
//     userId: currentUser._id,
//   });

//   if (res.data.success) {
//     setDiscount(res.data.discountPercentage);
//     const discount = res.data.discountPercentage;
//     const discountedTotal = Math.round(cartTotal * (1 - discount / 100));
//     setTotalPrice(discountedTotal);
//   } else {
//     toast.error(res.data.message);
//   }
// };
