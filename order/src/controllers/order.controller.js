const orderModel = require("../models/order.model")
const axios = require("axios")

async function createOrder(req,res){
    const user =req.user;
     const token = req.cookies?.token || req.headers?.authorization?.split(' ')[ 1 ];

     try{
        const cartResponse = await axios.get("http://localhost:3002/api/cart",{
         headers:{
            authorization:`Bearer ${token}`
         }
        })
        console.log(cartResponse.data)

     }catch(err){
        console.log("something has been broken",err)
     }

}

module.exports = {
    createOrder
}