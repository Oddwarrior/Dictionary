const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
    username: String,
    email: String,
    phone: String,
    password: String
}, {
    collation: "userInfo"
});

mongoose.model("userInfo", userDetailsSchema);
