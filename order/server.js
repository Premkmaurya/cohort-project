require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const {connect} = require("./src/broker/broker")

connectDB();
connect();

app.listen(3003, () => {
    console.log("server is running at port 3003.")
})