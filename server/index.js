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
require("dotenv").config();

//middlewares used 
app.use(cors());
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

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


  const PORT=5000 || process.env.PORT;
  const server = app.listen(PORT, () =>
    console.log(`Server started on ${PORT}`)
  );