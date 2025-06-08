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
    origin: [process.env.REACT_APP_CUSTOM_CLIENT_URL || "http://localhost:3000"],
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
const __dirname1 = path.resolve();
  app.use(express.static(path.join(__dirname1,'/public/build')));


  app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname1,"public","build","index.html"));
  })

//******************deployment********************/


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server started on ${PORT}`)
);

const io = socket(server, {
  cors: {
    origin: [process.env.REACT_APP_CUSTOM_CLIENT_URL||"http://localhost:3000"],
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