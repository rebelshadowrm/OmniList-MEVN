const express = require('express')
const mongodb = require('mongodb')
const dotenv = require("dotenv")
dotenv.config()
const UserModel = require('../../models/user/user')
const authenticateToken = require('../../security/authenticateToken')

const router = express.Router()

function normalizeUsername(username) {
    return username?.trim()?.toLowerCase()
}

function isEmailLike(value) {
    return /^\S+@\S+\.\S+$/.test(value)
}

function usernameCooldownMs(changeCount) {
    if (changeCount <= 0) return 0
    if (changeCount === 1) return 24 * 60 * 60 * 1000
    return 30 * 24 * 60 * 60 * 1000
}

function daysRemaining(ms) {
    return Math.ceil(ms / (24 * 60 * 60 * 1000))
}

// Get Users
router.get('/', authenticateToken, async (req, res) => {
    res.send(await UserModel.find())
})

// Get User by ID
router.get('/:id', authenticateToken, async (req, res) => {
    if(req?.params?.id !== undefined) {
        const user = await UserModel.findOne().where('_id').equals(req?.params?.id)
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
    if(req?.params?.id) {
        const user = await UserModel.findById(req?.params?.id)
        if(user) {
            let profileTheme
            let dashboardHome
            if(req?.user?.user?._id === req?.params?.id) {
                if(req?.body?.userName) {
                    const nextUserName = normalizeUsername(req?.body?.userName)
                    if (!nextUserName || nextUserName.length < 3 || nextUserName.length > 30) {
                        return res.status(400).send('Username must be between 3 and 30 characters')
                    }
                    if (!/^[a-z0-9._-]+$/.test(nextUserName) || isEmailLike(nextUserName)) {
                        return res.status(400).send('Username can only use letters, numbers, periods, underscores, and hyphens')
                    }

                    if (nextUserName !== user.userName) {
                        const changeCount = user.userNameChangeCount ?? 0
                        const cooldownMs = usernameCooldownMs(changeCount)
                        const changedAt = user.userNameChangedAt?.getTime?.() ?? 0
                        const availableAt = changedAt + cooldownMs
                        if (Date.now() < availableAt) {
                            return res.status(429).send(`Username can be changed again in ${daysRemaining(availableAt - Date.now())} day(s)`)
                        }

                        const userName = await UserModel.findOne({
                            userName: nextUserName,
                            _id: {$ne: user._id}
                        })
                        if(userName) {
                            return res.status(409).send('Username exists')
                        }

                        user.userNameChangeCount = changeCount + 1
                        user.userNameChangedAt = Date.now()
                    }

                    user.userName = nextUserName
                }
                user.firstName = req?.body?.firstName ?? user.firstName
                user.lastName = req?.body?.lastName ?? user.lastName
                user.img = req?.body?.img ?? user.img
                user.imgAlt = req?.body?.imgAlt ?? user.imgAlt
                user.bgImg = req?.body?.bgImg ?? user.bgImg
                if (Object.prototype.hasOwnProperty.call(req.body, 'dateOfBirth')) {
                    user.dateOfBirth = req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined
                }
                profileTheme = req?.body?.userPreferences?.themes?.profileTheme
                if (profileTheme !== undefined) {
                    user.set('userPreferences.themes.profileTheme', profileTheme)
                    user.markModified('userPreferences')
                }
                dashboardHome = req?.body?.userPreferences?.dashboardLayout?.home
                if (dashboardHome !== undefined) {
                    user.set('userPreferences.dashboardLayout.home', dashboardHome)
                    user.markModified('userPreferences')
                }
                user.userProfile.bio = req?.body?.bio ?? user.userProfile.bio
                if(req?.body?.addFavorite) {
                    const add = req?.body?.addFavorite
                    const mediaType = add?.mediaType ?? 'ANIME'
                    user.userProfile.favorites.mediaFavorites = user.userProfile.favorites.mediaFavorites ?? []
                    user.userProfile.favorites.animeFavorites = user.userProfile.favorites.animeFavorites ?? []
                    const mediaFavorites = user?.userProfile?.favorites?.mediaFavorites ?? []
                    const legacyFavorites = user?.userProfile?.favorites?.animeFavorites ?? []
                    const filter = [
                        ...mediaFavorites.map(({media}) => media),
                        ...legacyFavorites.map(({anime}) => anime),
                    ].filter(media => media?.id === add?.id && (media?.mediaType ?? 'ANIME') === mediaType)
                    if(filter.length === 0) {
                        user.userProfile.favorites.mediaFavorites.push({
                            media: add
                        })
                    }
                }
                if (req?.body?.removeFavorite) {
                    const remove = req?.body?.removeFavorite
                    const mediaType = remove?.mediaType ?? 'ANIME'
                    user.userProfile.favorites.mediaFavorites = user.userProfile.favorites.mediaFavorites ?? []
                    user.userProfile.favorites.animeFavorites = user.userProfile.favorites.animeFavorites ?? []
                    user.userProfile.favorites.mediaFavorites
                        =
                        user.userProfile.favorites.mediaFavorites
                        .filter(({media}) => media?.id !== remove?.id || (media?.mediaType ?? 'ANIME') !== mediaType)
                    user.userProfile.favorites.animeFavorites
                        =
                        user.userProfile.favorites.animeFavorites
                        .filter(({anime}) => anime?.id !== remove?.id || (anime?.mediaType ?? 'ANIME') !== mediaType)
                }
                if (req?.body?.socialName) {
                    user.userProfile.socials.push({
                        socialName: req?.body?.socialName,
                        socialType: req?.body?.socialType,
                        socialValue: req?.body?.socialValue
                    })
                }
                if (req?.body?.removeSocial) {
                    const id = req?.body?.removeSocial
                    user.userProfile.socials =
                        user.userProfile.socials
                        .filter( ({_id}) => _id.toString() !== id )
                }
            }

            // Admin / Mod changes
            if(req?.user?.user?.role === 'ADMIN') {
                user.role = req?.body?.role ?? user.role
            }
            if(req?.user?.user?.role === 'ADMIN' || req?.user?.user?.role === 'MOD') {
                user.status = req?.body?.status ?? user.status
            }

            await user.save()

            if (profileTheme !== undefined) {
                await UserModel.updateOne(
                    {_id: user._id},
                    {$set: {'userPreferences.themes.profileTheme': profileTheme}}
                )
            }
            if (dashboardHome !== undefined) {
                await UserModel.updateOne(
                    {_id: user._id},
                    {$set: {'userPreferences.dashboardLayout.home': dashboardHome}}
                )
            }

            const updatedUser = await UserModel.findById(user._id)
            return res.status(200).send(updatedUser ?? user)
        } else {
            return res.sendStatus(400)
        }
    }

})

module.exports = router
