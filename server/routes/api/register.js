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
        if(emailExist.length > 0) { return res.status(422).send('User exists')}
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = await UserModel.create({
            userName: req.body.username,
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
