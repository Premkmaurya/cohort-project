const mongoose = require('mongoose')


async function connectDB() {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to db.')
    } catch (error) {
        console.log("error occured",error)
    }
}

module.exports = connectDB;