import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    fullName : {
        type : Number,
        required : true,
    },
    mobile : {
        type : Number,
        default : null,
        required : true,
    },
    houseNumber : {
        type : String,
        required : true,
    },
    address_line : {
        type : String,
        default : ""
    },
    landmark : {
        type : String,
    },
    pincode : {
        type : String,               //the default value will be undefined when u didnot define default value explicitly.     
        required : true,  
    },
    city : {
        type : String,
        default : "",
        required : true,
    },
    country : {
        type : String,
    },
    state : {
        type: String,
        default: "",
        required : true,
    },
    status : {
        type : Boolean,
        default : true,
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        default : ''
    },
},{timestamps : true}) 

const addressModel = mongoose.model("address", addressSchema)
export default addressModel;