require('dotenv').config()
const app = require("./src/app")
const {connect} = require('./src/broker/broker')
const listen = require("./src/broker/listener")

connect().then(()=>{
    listen();
})

app.listen(3006,()=>{
    console.log("notification service is running on port 3006.");
    
})