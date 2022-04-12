const dotenv = require("dotenv")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('../database')
const UserModel = require('../models/user/user')
const TokenModel = require('../models/tokens')
dotenv.config()

const authenticateUser = async function(req, res, next) {
    try {
        const email = req.body.email
        //db check if user exists
        const user = await UserModel.findOne({email: email})
        if(user == null) return res.status(400).send('Cannot find user')
        //check password
        if(await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken(user.toJSON())
            const refreshToken = await generateRefreshToken(user.toJSON())
            //return tokens
            res.json({ accessToken: accessToken, refreshToken: refreshToken })
            next()
        } else {
            res.status(400).send('bad password')
        }
    } catch(err) {
        res.status(500).send(err.message)
    }
}
const generateAccessToken = (user) => {
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m'})
}
const generateRefreshToken = async (user) => {
     const token = await TokenModel.create({
        refreshToken: jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET)
    })
    return token.refreshToken
}

module.exports = { authenticateUser, generateAccessToken, generateRefreshToken }
