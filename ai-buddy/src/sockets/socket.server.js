const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const agent = require("../agents/agent");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use((socket, next) => {
    const cookies = socket.handshake.headers?.cookie;
    const { token } = cookies ? cookie.parse(cookies) : {};
    if (!token) {
      return next(new Error("token not provided"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.user = decoded;
      socket.token = token;
      next();
    } catch (err) {
      return next(new Error("unautharized"));
    }
  });

  io.on("connection", (socket) => {



    socket.on("messages", async (data) => {
      const agentResponse = await agent.invoke(
        {
          messages: [
            {
              role: "user",
              content: data,
            },
          ],
        },
        {
          metadata: {
            token: socket.token,
          },
        }
      );
      const lastMessage = agentResponse.messages[agentResponse.messages.length-1]

      socket.emit("messages",lastMessage.content)
    });
  });
}

module.exports = { initSocketServer };
