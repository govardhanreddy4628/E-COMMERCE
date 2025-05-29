import mongoose, { Document } from "mongoose";  //In Mongoose + TypeScript, every model instance you retrieve from the database (e.g., const user = await User.findById(id)) is not just a plain object — it's a Mongoose document that comes with built-in methods like .save(), .populate(), etc.So, Document is the base type for these returned objects.
const { Schema } = mongoose;

type DeliveryDetails = {
    email: string;
    name: string;
    address: string;
    city: string;
}

type CartItems = {
    menuId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    user: mongoose.Schema.Types.ObjectId;
    deliveryDetails: DeliveryDetails,
    cartItems: CartItems;
    totalAmount: number;
    status: "pending" | "confirmed" | "preparing" | "outfordelivery" | "delivered"
}

const paymentMethods = {
  values: ['card', 'cash'],
  message: 'enum validator failed for payment Methods'
}


const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number },  // you can write this like totalAmount:Number, but object typt allows you to configure additional options like:required,default,min / max, validate, enum (for strings) and more...
    totalItems: { type: Number },
    paymentMethod: { type: String, required: true, enum: paymentMethods },
    paymentStatus: { type: String, default: 'pending' },   //when you have default value you no need to mention required:true.
    status:{
        type:String,
        enum:["pending" , "confirmed" , "preparing" , "outfordelivery" , "delivered"],
        // required:true,
        default: 'pending'
    }
    selectedAddress: { type: Schema.Types.Mixed, required: true },
    deliveryDetails:{
        email:{type:String, required:true},
        name:{type:String, required:true},
        address:{type:String, required:true},
        city:{type:String, required:true},
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

exports.Order = mongoose.model('Order', orderSchema);














   
   
    
    
    


}, { timestamps: true });
export const Order = mongoose.model("Order", orderSchema);