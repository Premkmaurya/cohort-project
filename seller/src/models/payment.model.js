const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema({
    order:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    paymentId:{
        type:String,
    },
    razorpayId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["PENDING","SUCCESS","FAILED"],
        default:"PENDING"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            enum:["INR","USD"], 
            default:"INR",
            required:true
        }
    },
    signature:{
        type:String
    }
},{timestamps:true})

const paymentModel = mongoose.model("payment",paymentSchema)

module.exports = paymentModel;