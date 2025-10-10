require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/product.route');

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).json({
        messsage:"product service is running."
    })
})

app.use('/api/products', productRoutes);

module.exports = app;