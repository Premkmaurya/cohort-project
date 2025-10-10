require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const { connect } = require("./src/broker/broker");
const listener = require("./src/broker/listener")

connectDB();
connect().then(()=>{
    listener()
});

app.listen(3007, () => {
  console.log("seller service running on port 3007.");
});
