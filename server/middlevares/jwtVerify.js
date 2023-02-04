const jwt = require("jsonwebtoken");

const jwtVerify = async (req, res, next) => {

    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).send({ error: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ error: err.message });
        }
        else {
            req.user = decoded.id;
            next();
        }
    });

}
module.exports = jwtVerify;