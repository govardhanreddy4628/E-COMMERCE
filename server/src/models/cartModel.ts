import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICart extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  userId: mongoose.Types.ObjectId;
  size?: unknown; // Mixed can be unknown or any
  color?: unknown;
}

const cartSchema = new Schema<ICart>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    size: { type: Schema.Types.Mixed },
    color: { type: Schema.Types.Mixed },
  },
  { timestamps: true } // ✅ corrected spelling
);

// Virtual field
cartSchema.virtual('id').get(function (this: ICart) {
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

const CartModel: Model<ICart> = mongoose.model<ICart>('Cart', cartSchema);

export default CartModel;
