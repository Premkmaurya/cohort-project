require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db')
const {connect} = require("./src/broker/broker")

connectDB();
connect();


app.listen(3000,()=>{
    console.log('server is listen at post 3000.')
})