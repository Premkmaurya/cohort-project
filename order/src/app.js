const express = require("express");
const cookieParser = require("cookie-parser");
const orderRoutes = require("./routes/order.route")

const app = express()
app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.status(200).json({
        message:"order service is running."
    })
})

app.use("/api/orders",orderRoutes);


module.exports = app;