"use strict";
const express = require("express");
const jwt = require("jsonwebtoken");
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
        return res.status(200).send({ status: "ok", message: "user registation successful !" });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email.length === 0) return res.status(404).send({ error: "Please provide email" })
        const existingUser = await user.findOne({ email });
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!existingUser) {
            return res.status(404).send({ error: "User not found" });
        }

        const passwordMatched = await bcrypt.compare(password, existingUser.password);
        //password mismatched
        if (!passwordMatched) {
            return res.status(404).send({ error: "email or password missmatched" });
        }

        const payload = { user: { id: existingUser.id, email } }
        const bearerToken = jwt.sign(payload, JWT_SECRET, { expiresIn: 86400 });
        console.log(existingUser);

        return res.status(200).send({ status: "ok", token: `${bearerToken}`, message: "user login successful !" });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
module.exports = router;