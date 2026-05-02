const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserModel = require('../../models/user/user')
const TokenModel = require('../../models/tokens')
const PasswordResetTokenModel = require('../../models/passwordResetToken')
const {generateAccessToken} = require('../../security/authenticateUser')
const {clearRefreshCookie, readRefreshToken} = require('../../utils/authCookies')
const authenticateToken = require('../../security/authenticateToken')

const router = express.Router()

async function sessionFromRefreshToken(refreshToken) {
    if (!refreshToken) {
        return null
    }

    const exists = await TokenModel.exists({refreshToken})

    if (!exists) {
        return null
    }

    return await new Promise((resolve) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
            if (err) {
                resolve(null)
                return
            }

            const userId = payload?.user?._id

            if (!userId) {
                resolve(null)
                return
            }

            const user = await UserModel.findById(userId)

            if (!user) {
                resolve(null)
                return
            }

            const authUser = {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                status: user.status,
                role: user.role,
            }

            resolve({
                user,
                accessToken: generateAccessToken(authUser),
            })
        })
    })
}

router.get('/session', async (req, res) => {
    const refreshToken = readRefreshToken(req)
    const session = await sessionFromRefreshToken(refreshToken)

    if (session?.user) {
        return res.status(200).send({
            user: session.user,
            accessToken: session.accessToken,
        })
    }

    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(200).send({
            user: null,
            accessToken: null,
        })
    }

    return authenticateToken(req, res, async () => {
        const user = await UserModel.findById(req?.user?.user?._id)

        return res.status(200).send({
            user: user ?? null,
            accessToken: token,
        })
    })
})

router.post('/forgot-password', async (req, res) => {
    const email = `${req.body?.email ?? ''}`.trim().toLowerCase()

    if (!email) {
        return res.status(400).send({message: 'Email is required'})
    }

    const user = await UserModel.findOne({email})

    if (user) {
        const resetToken = jwt.sign({
            userId: `${user._id}`,
            purpose: 'password-reset',
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1h',
        })

        await PasswordResetTokenModel.deleteMany({user: user._id, usedAt: {$exists: false}})
        await PasswordResetTokenModel.create({
            user: user._id,
            tokenHash: PasswordResetTokenModel.hashToken(resetToken),
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        })

        const response = {
            message: 'If an account exists for that email, a reset token has been issued.',
        }

        if (process.env.NODE_ENV !== 'production') {
            response.resetToken = resetToken
        }

        return res.status(202).send(response)
    }

    return res.status(202).send({
        message: 'If an account exists for that email, a reset token has been issued.',
    })
})

router.post('/reset-password', async (req, res) => {
    const token = `${req.body?.token ?? ''}`.trim()
    const password = `${req.body?.password ?? ''}`

    if (!token || !password) {
        return res.status(400).send({message: 'Token and password are required'})
    }

    const tokenHash = PasswordResetTokenModel.hashToken(token)
    const resetToken = await PasswordResetTokenModel.findOne({
        tokenHash,
        usedAt: {$exists: false},
        expiresAt: {$gt: new Date()},
    })

    if (!resetToken) {
        return res.status(400).send({message: 'Reset token is invalid or expired'})
    }

    let payload
    try {
        payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
        return res.status(400).send({message: 'Reset token is invalid or expired'})
    }

    if (`${payload?.userId ?? ''}` !== `${resetToken.user}`) {
        return res.status(400).send({message: 'Reset token is invalid or expired'})
    }

    const user = await UserModel.findById(resetToken.user)

    if (!user) {
        return res.status(400).send({message: 'Reset token is invalid or expired'})
    }

    user.password = await bcrypt.hash(password, 10)
    await user.save()
    resetToken.usedAt = new Date()
    await resetToken.save()

    return res.status(200).send({message: 'Password reset successful'})
})

router.delete('/session', async (req, res) => {
    const refreshToken = readRefreshToken(req)

    if (refreshToken) {
        await TokenModel.deleteOne({refreshToken})
    }

    clearRefreshCookie(res)
    res.sendStatus(204)
})

module.exports = router
