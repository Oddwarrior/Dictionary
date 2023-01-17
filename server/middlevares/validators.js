const express = require("express");

const validators = (req, res, next) => {
    const { email, password } = req.body;
    // Regular expression for email validation
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // Regular expression for password validation (at least one uppercase letter, one lowercase letter, one number, and one special character)
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Check if email is valid
    if (!emailRegex.test(email)) {
        return res.status(400).send({ error: "Invalid email address" });
    }

    // Check if password is valid
    if (!passwordRegex.test(password)) {
        return res.status(400).send({ error: "Invalid password. Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character" });
    }

    next();
}

module.exports = validators;