const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    words: [Object]
}, {
    collection: "userInfo"
});

mongoose.model("userInfo", userDetailsSchema);
