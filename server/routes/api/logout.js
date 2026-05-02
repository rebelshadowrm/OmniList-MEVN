const express = require('express')
const TokenModel = require('../../models/tokens')
const {clearRefreshCookie, readRefreshToken} = require('../../utils/authCookies')
const router = express.Router()

router.delete('/', async (req, res) => {
    const refreshToken = readRefreshToken(req)

    if (refreshToken) {
        await TokenModel.deleteOne({refreshToken})
    }

    clearRefreshCookie(res)
    res.sendStatus(204)
})

module.exports = router
