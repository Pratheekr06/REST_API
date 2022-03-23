const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {;
    const bearerToken = req.header("Authorization");
    console.log(token)
    if (!bearerToken) {
        return res.status(401).json({ msg: "No Such Token, Authorization Denied" });
    }
    try {
        const token = bearerToken.split('-')[1];
        const verification = jwt.verify(token, "" + process.env.jwtSecret);
        console.log(verification + " " + token)
        req.user = verification;
        next();
    } catch (e) {
        res.status(400).json({ msg: "Invalid Token" });
    }
}