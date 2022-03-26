const express = require('express')
const bcrypt = require('bcrypt')
const dotenv = require("dotenv")
dotenv.config()
require('../../database')
const UserModel = require("../../models/user/user");

const router = express.Router()

//create validation?

router.post('/', async (req, res) => {
    try {
        const emailExist = await UserModel.find({email: req.body.email})
        if(emailExist.length > 0) { return res.status(422).send('Email exists')}
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const usernameEmpty = req.body?.username ?? ''
        if(usernameEmpty !== '') {
            const userExist = await UserModel.find({userName: req.body.username})
            if(userExist.length > 0) { return res.status(409).send('Username exists')}
        }
        let username = req.body?.username === '' || undefined ? req.body.email.split('@')[0] : req.body.username
        const usernameExist = await UserModel.find({userName: username})
        if(usernameExist.length > 0) {
            const newUsername = `${username}${Math.random() * 99 + 1}`
            const usernameExist = await UserModel.find({userName: newUsername})
            if(usernameExist.length > 0) { return res.status(409).send('Username exists')}
            username = newUsername
        }
        const setUsername = username
        const user = await UserModel.create({
            userName: setUsername,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        })
        res.status(201).send(user)
    } catch(err) {
        res.status(400).send(err.message)
    }
})

module.exports = router
