const jwt = require("jsonwebtoken");

const jwtVerify = async (req, res, next) => {

    try {
        const authHeader = req.header("Authorization");
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.status(401).send({ error: "Access denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "user verification failed" });
    }


}
module.exports = jwtVerify;