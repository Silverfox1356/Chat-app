// server/index.js

// 1) Load .env (make sure you have a file like server/.env with REACT_APP_CLIENT_URL set)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const http = require("http");
const path = require("path");

// 2) Import your routes
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");

////////////////////////////////////////////////////////////////////////////////
//––– EXPRESS + MONGOOSE SETUP ––––––––––––––––––––––––––––––––––––––––––––––––
////////////////////////////////////////////////////////////////////////////////

const app = express();

// 3) Configure CORS middleware to only allow your React/ngrok origin
const CLIENT_URL = process.env.REACT_APP_CUSTOM_CLIENT_URL||"http://localhost:3000";

console.log("client url is: ",CLIENT_URL);

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// 4) Allow parsing JSON bodies
app.use(express.json());

// 5) Connect to MongoDB
const MONGO_URL = process.env.CUSTOM_MONGO_URL || "mongodb://localhost:27017/";
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log("MongoDB Error:", err.message));

// 6) Basic ping endpoint
app.get("/ping", (_req, res) => res.json({ msg: "Ping Successful" }));

// 7) Mount your API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// 8) If you have a React build in `public/build`, serve it
const __root = path.resolve();
app.use(express.static(path.join(__root, "public", "build")));
app.get("*", (_req, res) => {
  res.sendFile(path.join(__root, "public", "build", "index.html"));
});

// 9) Start the HTTP server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

////////////////////////////////////////////////////////////////////////////////
//–––– SOCKET.IO SETUP (with CORS) ––––––––––––––––––––––––––––––––––––––––––––
////////////////////////////////////////////////////////////////////////////////

// 10) Initialize Socket.IO and explicitly allow the same origin as above.
const io = new socketIO.Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 11) Keep track of online users
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User added: ${userId} → ${socket.id}`);
    console.log("Current online users:", Array.from(onlineUsers.entries()));
  });

  socket.on("send-msg", (data) => {
    console.log("Received message:", data);
    const recipientSocket = onlineUsers.get(data.to);
    if (recipientSocket) {
      console.log(`Forwarding from ${data.from} → ${data.to}`);
      socket.to(recipientSocket).emit("msg-receive", data.msg);
    } else {
      console.log(`User ${data.to} not connected. Online now:`, Array.from(onlineUsers.entries()));
    }
  });

  socket.on("disconnect", () => {
    // Remove this socket from the global map
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User disconnected: ${userId}`);
      }
    }
    console.log("Remaining online users:", Array.from(onlineUsers.entries()));
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
