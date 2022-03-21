const express = require('express')
const {authenticateUser} = require('../../security/authenticateUser')
const router = express.Router()

router.post('/', authenticateUser)

module.exports = router
