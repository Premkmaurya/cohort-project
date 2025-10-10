const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("seller db connected successfully.")
    } catch (error) {
        console.log("database is not connected successfully.")
    }
}

module.exports = connectDB;