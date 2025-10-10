const {subscribeToQueue} = require("./broker");
const paymentModel = require("../models/payment.model")
const userModel = require("../models/user.model");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model")

module.exports = async function (){
    subscribeToQueue("SELLER_DASHBOARD_USER_REGISTERED",async (data)=>{
        await userModel.create(data)
    })

    subscribeToQueue("SELLER_DASHBOARD_PRODUCT_CREATED",async (data)=>{
        await productModel.create(data)
    })

    subscribeToQueue("SELLER_DASHBOARD_PAYMENT_CREATED",async (data)=>{
        await paymentModel.create(data)
    })
    
    subscribeToQueue('SELLER_DASHBOARD_PAYMENT_UPDATED',async (data)=>{
        await paymentModel.findOneAndUpdate({id:data._id})
    })
    
    subscribeToQueue("SELLER_DASHBOARD_ORDER_CREATED",async (data)=>{
        await orderModel.create(data)
    })
}