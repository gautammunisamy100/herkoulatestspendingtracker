"use strict";
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const mogoURI = process.env.MOGO_URI;

const mongooseConnect = async () => {
  try {
    await mongoose.connect(mogoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log("mogodb connected..!");
  } catch (err) {
    console.log(`mogodb error : ${err.message}`);
  }
};

module.exports = mongooseConnect;
