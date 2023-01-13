"use strict";
const express = require("express");
require("dotenv").config();

let router = express.Router();
const bcrypt = require("bcrypt");

const { default: mongoose } = require("mongoose");

//mongo db connection
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL, { useNewUrlParser: true }).then(() => {
    console.log("Connected to database");
}).catch((error) => console.log(error));


//create user (signin)
require("../schema/user-details");
const user = mongoose.model("userInfo");

router.post("/signup", async (req, res) => {
    const { name, email, mobile } = req.body;
    try {
        await user.create({
            username: name,
            email,
            phone: mobile,
        })
        res.status(200).send({ status: ok });
    } catch (error) {
        res.send(error);
    }

});

router.get("/signin", async (req, res) => {
    res.send("signin response");
});
module.exports = router;