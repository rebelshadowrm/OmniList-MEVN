const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()
require('../../database')
const TokenModel = require('../../models/tokens')
const {generateAccessToken} = require('../../security/authenticateUser')

router.post('/', async (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (await TokenModel.exists({refreshToken: refreshToken}) == null) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send(err.message)
        const accessToken = generateAccessToken(user)
        res.json({accessToken: accessToken})
    })
})

module.exports = router
