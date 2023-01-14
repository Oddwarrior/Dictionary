"use strict";
const express = require("express");
require("dotenv").config();

let router = express.Router();
const bcrypt = require("bcrypt");

const { default: mongoose } = require("mongoose");
const validators = require("../middlevares/validators");

//mongo db connection
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL, { useNewUrlParser: true }).then(() => {
    console.log("Connected to database");
}).catch((error) => console.log(error));


//create user (signin)
require("../schema/user-details");
const user = mongoose.model("userInfo");

router.post("/signup", validators, async (req, res) => {
    const { fname, lname, email, mobile, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const oldUser = await user.findOne({ email });
        if (oldUser) {
            return res.send({ error: "User already exists" });
        }
        await user.create({
            fname,
            lname,
            email,
            phone: mobile,
            password: hashedPassword,
            words: {}
        })
        return res.status(200).send({ status: "ok" });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});

router.get("/signin", async (req, res) => {
    res.send("signin response");
});
module.exports = router;