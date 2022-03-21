const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()

const authenticateToken = function(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        err?.message === undefined ? console.log('jwt verified') : console.log(err?.message)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = authenticateToken
