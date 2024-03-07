const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to mongodb.....");
  })
  .catch((e) => console.log("Error occured connecting to mongodb", e));
