const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const connectMongoDB = require("./Configs/ConfigDB");
const UserRoute= require("./Routes/UserRoute");
const DefaultRoute= require("./Routes/DefaultRoute");


app.use(cors());
app.use(bodyParser.json());
app.use("/", DefaultRoute);
app.use("/api/auth", UserRoute);
app.listen(port, (error) => {
  if (error) {
    console.log(error.message, "Server Failed to Start");
  } else {
    console.log(`Server is running on port ${port}`);
  }
});

connectMongoDB();
