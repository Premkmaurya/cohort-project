const express = require('express')
const cookieParser = require("cookie-parser")
const sellerRoutes = require("./routes/seller.route")


const app = express()
app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.status(200).json({
        message:"seller service is running."
    })
})

app.use("/api/seller/dashboard",sellerRoutes)

module.exports = app;