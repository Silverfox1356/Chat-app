//adding the plateform for making of websites
const express = require("express");
//adding cors to deal with diffrent local host like 3000 3001  
const cors = require("cors");
const mongoose = require("mongoose");
//add all routes to this page
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
//stating app on express plateform 
const app = express();
//sockets for synchrounous chatting 
const socket = require("socket.io");
const path =require("path");
require("dotenv").config();


//middlewares used
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());


const MONGO_URL = process.env.CUSTOM_MONGO_URL||"mongodb://localhost:27017/";

//to connect the mongodb database
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });



app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});


//using middleware for app  
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes); 


//******************deployment********************/
// Resolve the path to the React build directory correctly. When the server is
// started from the `server` folder, `path.resolve()` points to that folder,
// leaving the build assets unresolved. Using `__dirname` and navigating one
// level up ensures the `client/build` directory is found regardless of the
// working directory.
// In production serve React build from client/build. When running in
// development the React dev server will handle serving the front-end so we
// skip registering these routes.
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "..", "client", "build");

  app.use(express.static(clientBuildPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

//******************deployment********************/


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server started on ${PORT}`)
);

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

global.onlineUsers = new Map();


//this builds a connection to socket or client {io.on}
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  //when frontend add the user we catch and stores in our data base using string add-user
  socket.on("add-user", (userId) => {
    //adding the userid and socket id in map 
    onlineUsers.set(userId, socket.id);
    console.log(`User added: ${userId} with socket ID: ${socket.id}`);
    console.log("Current online users after adding user:", Array.from(onlineUsers.entries()));
  });

    //similar with string send-msg 
  socket.on("send-msg", (data) => {
    console.log("Received message data:", data);

    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      console.log(`Sending message from ${data.from} to ${data.to}`);
      socket.to(sendUserSocket).emit("msg-receive", data.msg);
    } else {
      console.log(`User ${data.to} not connected. Current online users:`, Array.from(onlineUsers.entries()));
    }
  });

  //when user disconnected and we have to delete it from online users 
  socket.on("disconnect", () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
        console.log(`User disconnected: ${key}`);
      }
    });
    console.log("Current online users after disconnect:", Array.from(onlineUsers.entries()));
  });

  socket.on("error", (err) => {
    console.error(`Socket error: ${err}`);
  });
}); 