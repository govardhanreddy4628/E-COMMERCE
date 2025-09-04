import mongoose, { Document } from "mongoose";  //In Mongoose + TypeScript, every model instance you retrieve from the database (e.g., const user = await User.findById(id)) is not just a plain object — it's a Mongoose document that comes with built-in methods like .save(), .populate(), etc.So, Document is the base type for these returned objects.
const { Schema } = mongoose;



type CartItems = {
    menuId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    orderId: string,
    productId: mongoose.Schema.Types.ObjectId;
    product_details: {name: string, image: string[]};
    paymentId: string;
    subTotalAmt: number;
    delivery_details: mongoose.Schema.Types.ObjectId;
    cartItems: CartItems;
    totalItems: number;
    paymentMethod: string;
    paymentStatus: string;
    selectedAddress: any;
    totalAmount: number;
    status: "pending" | "confirmed" | "preparing" | "outfordelivery" | "delivered"
}

const paymentMethods = {
  values: ['card', 'cash'],
  message: 'enum validator failed for payment Methods'
}


const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    orderId : {
      type : String,
      required : [true, "Provide orderId"],
      unique : true
    },
    productId : {
      type : mongoose.Schema.ObjectId,
      ref : "Product"
    },
    product_details : {
      name : String,
      image : Array,
    },
    paymentId : {
      type : String,
      default : "",
    },
    paymentStatus: { 
      type: String, 
      default: 'pending' },   //when you have default value you no need to mention required:true.
    subTotalAmt : {
      type : Number,
      default : 0,
    },
    totalAmount: { type: Number, default: 0 },  // you can write this like totalAmount:Number, but object typt allows you to configure additional options like:required,default,min / max, validate, enum (for strings) and more...
    totalItems: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true, enum: paymentMethods },
    status:{
        type:String,
        enum:["pending" , "confirmed" , "preparing" , "outfordelivery" , "delivered"],
        default: 'pending'
    },
    delivery_details: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
      required: true
    },
    cartItems:[
        {
            menuId:{type:String, required:true},
            name:{type:String, required:true},
            image:{type:String, required:true},
            price:{type:Number, required:true},
            quantity:{type:Number, required:true},
        }
    ],
  },
  { timestamps: true }
);

const virtual = orderSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});


export const orderModel = mongoose.model("Order", orderSchema);