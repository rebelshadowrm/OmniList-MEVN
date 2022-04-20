const express = require('express')
const TokenModel = require('../../models/tokens')
const router = express.Router()

router.delete('/', async (req, res) => {
    const del = await TokenModel.deleteOne({refreshToken: req.body.refreshToken})
    if(del.acknowledged) {
        res.sendStatus(204)
    } else {
        res.sendStatus(400)
    }
})

module.exports = router