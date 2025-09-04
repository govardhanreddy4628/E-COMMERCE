"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const { Schema } = mongoose;
const cartSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    size: { type: Schema.Types.Mixed },
    color: { type: Schema.Types.Mixed },
}, { timeStamps: true });
const virtual = cartSchema.virtual('id');
virtual.get(function () {
    return this._id;
});
cartSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});
const CartModel = mongoose.model('Cart', cartSchema);
exports.default = CartModel;
