"use strict";
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let router = express.Router();
const bcrypt = require("bcrypt");

const { default: mongoose } = require("mongoose");
const validators = require("../middlevares/validators");
const jwtVerify = require("../middlevares/jwtVerify")

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

        const id = existingUser.id;
        const payload = { user: { id, email, fname: existingUser.fname, lname: existingUser.lname, words: existingUser.words } };

        const bearerToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: '10d' });
        return res.status(200).send({ status: "ok", message: "user login successful !", token: bearerToken, user: payload.user });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// READ
router.get("/profile/:id", jwtVerify, async (req, res) => {
    try {
        const id = req.params.id;
        const existingUser = await user.findOne({ id: id });

        if (!existingUser) return res.status(400).send("user not found");

        const { fname, lname, email, phone, words } = existingUser;
        res.status(200).send({ fname, lname, email, phone, words });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

})

//UPDATE words
router.patch("/updateWord/:id", jwtVerify, async (req, res) => {
    try {
        const id = req.params.id;
        if (id != req.user) return res.status(400).send("update failed");

        const { word } = req.body;

        const found = await user.findOne({ _id: id, words: { $in: [word] } });

        if (!found) {
            await user.findOneAndUpdate({ _id: id }, { $addToSet: { words: word } });
        } else {
            await user.findOneAndUpdate({ _id: id }, { $pull: { words: word } });
        }
        const updatedUser = await user.findOne({ _id: id });
        const { fname, lname, email, phone, words } = updatedUser;
        res.status(200).send({ fname, lname, email, phone, words });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

})

module.exports = router;