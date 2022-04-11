const express = require('express')
const mongodb = require('mongodb')
const dotenv = require("dotenv")
dotenv.config()
require('../../database')
const UserModel = require('../../models/user/user')
const authenticateToken = require('../../security/authenticateToken')

const router = express.Router()

// Get Users
router.get('/', authenticateToken, async (req, res) => {
    res.send(await UserModel.find())
})

// Get User by ID
router.get('/:id', authenticateToken, async (req, res) => {
    if(req.params) {
        const user = await UserModel.findOne({ _id: new mongodb.ObjectId(req.params.id) })
        if(user) {
            res.status(200).send(user)
        } else {
            res.sendStatus(400)
        }
    } else {
        res.sendStatus(400)
    }

})

// Get User by Username
router.get('/username/:username', authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({ userName: req.params.username })
    if(user) {
        res.status(200).send(user)
    } else {
        res.sendStatus(400)
    }
})

module.exports = router
