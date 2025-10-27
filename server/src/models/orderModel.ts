import mongoose, { Document } from "mongoose"; //In Mongoose + TypeScript, every model instance you retrieve from the database (e.g., const user = await User.findById(id)) is not just a plain object — it's a Mongoose document that comes with built-in methods like .save(), .populate(), etc.So, Document is the base type for these returned objects.
const { Schema } = mongoose;

type CartItems = {
  menuId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};


const OrderItem = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId, ref: "Product" },
  qty: Number,
  price: Number
}, { _id: false });


export interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  orderId: string;
  productId: mongoose.Schema.Types.ObjectId;
  product_details: { name: string; image: string[] };
  paymentId: string;
  subTotalAmt: number;
  delivery_details: mongoose.Schema.Types.ObjectId;
  cartItems: CartItems;
  totalItems: number;
  payment: paymentSchema;
  selectedAddress: any;
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "outfordelivery"
    | "delivered";
}

const paymentMethods = {
  values: ["card", "cash"],
  message: "enum validator failed for payment Methods",
};

const PaymentSchema = new mongoose.Schema({
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  paymentMethod: { type: String, required: true, enum: paymentMethods },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  captured: Boolean,
  amount: Number,
});

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: [true, "Provide orderId"],
      unique: true,
    },
    items: [OrderItem],
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    product_details: {
      name: String,
      image: Array,
    },
    payment: PaymentSchema,
    currency: { type: String, default: "INR" },
    subTotalAmt: {
      type: Number,
      default: 0,
    },
    totalItems: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 }, // you can write this like totalAmount:Number, but object typt allows you to configure additional options like:required,default,min / max, validate, enum (for strings) and more...
    amount: { type: Number, required: true }, // in smallest currency unit (e.g. paise)
    status: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "processing",
        "shipped",
        "outfordelivery",
        "delivered",
        "cancelled",
        "requested for return",
        "returned",
        "refunded",
      ],
      default: "pending",
    },
    delivery_details: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
      required: true,
    },
    cartItems: [
      {
        menuId: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    shipping: {
      carrier: String,
      trackingNumber: String,
      estimatedDelivery: Date,
      status: String,
    },
  },
  { timestamps: true }
);

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

// const OrderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
//   items: [
//     {
//       productId: String,
//       name: String,
//       price: Number,
//       qty: Number,
//     },
//   ],
// });

// export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
