import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWishlist extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  userId: mongoose.Types.ObjectId;
  size?: unknown; // Mixed can be unknown or any
  color?: unknown;
}


const cartSchema = new Schema<IWishlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    //   items: [{ productId: { type: mongoose.Types.ObjectId, ref: "Product" }, qty: Number }],
    size: { type: Schema.Types.Mixed },
    color: { type: Schema.Types.Mixed },
  },
  { timestamps: true } // ✅ corrected spelling
);

// Virtual field
cartSchema.virtual('id').get(function (this: IWishlist) {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});

// Transform JSON output
cartSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    delete ret._id;
  },
});

const CartModel: Model<IWishlist> = mongoose.model<IWishlist>('Wishlist', cartSchema);

export default CartModel;



