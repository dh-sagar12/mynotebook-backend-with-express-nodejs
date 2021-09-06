require('dotenv').config()
const jwt = require('jsonwebtoken');

const JWT_TOKEN = process.env.JWT_SECRET_KEY


const fetchuser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Unauthorized Access Token" })
    }
    try {
        const data = jwt.verify(token, JWT_TOKEN);
        req.user = data.user
    } catch (error) {
        res.status(401).send({ error: "Unauthorized Access Token" })

    }
    next()
}

module.exports = fetchuser;