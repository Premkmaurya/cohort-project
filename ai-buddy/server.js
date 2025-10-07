require("dotenv").config()
const app = require("./src/app")
const http = require("http")
const {initSocketServer} = require("./src/sockets/socket.server")

const httpServer = new http.createServer(app)
initSocketServer(httpServer)

httpServer.listen(3005,()=>{
    console.log("ai-buddy listen at port 3005.")
})