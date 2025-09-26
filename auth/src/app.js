const express = require('express');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.route')

const app = express()
app.use(express.json())
app.use('/api/user',authRoutes)
app.use(cookieParser())

module.exports = app;