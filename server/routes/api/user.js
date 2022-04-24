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
    if(req.params.id.length !== undefined) {
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

// Update User
router.put('/:id', authenticateToken, async (req, res) => {
    const user = await UserModel.findById(req.params.id)
    if(user) {
        if(req?.body?.userName) {
            const userName = await UserModel.findOne({userName: req.body.userName})
            if(userName) res.sendStatus(400)
            user.userName = req?.body?.userName ?? user.userName
        }
        user.firstName = req?.body?.firstName
        user.lastName = req?.body?.lastName
        if(user.role === 'admin') {
            user.role = req?.body?.role ?? user.role
        }
        user.userPreferences = req?.body?.userPreferences ?? user.userPreferences
        user.userPreferences.themes.profileTheme = req?.body?.userPreferences.themes.profileTheme ?? user.userPreferences.themes.profileTheme
        user.userProfile = req?.body?.userProfile ?? user.userProfile
        user.save()
        res.status(200).send(user)
    } else {
        res.sendStatus(400)
    }
})

module.exports = router
