const express = require('express')
const mongodb = require('mongodb')
const dotenv = require("dotenv")
dotenv.config()
require('../../database')
const UserModel = require('../../models/user/user')
const authenticateToken = require('../../security/authenticateToken')

const router = express.Router()

// Get Posts
router.get('/', authenticateToken, async (req, res) => {
    res.send(await UserModel.find())
});

module.exports = router
