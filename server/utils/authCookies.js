const REFRESH_COOKIE_NAME = 'refresh_token'

function cookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
    }
}

function readRefreshToken(req) {
    return req?.cookies?.[REFRESH_COOKIE_NAME]
        ?? req?.body?.token
        ?? req?.body?.refreshToken
        ?? null
}

function setRefreshCookie(res, refreshToken) {
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions())
}

function clearRefreshCookie(res) {
    res.clearCookie(REFRESH_COOKIE_NAME, {
        ...cookieOptions(),
        maxAge: undefined,
    })
}

module.exports = {
    REFRESH_COOKIE_NAME,
    clearRefreshCookie,
    cookieOptions,
    readRefreshToken,
    setRefreshCookie,
}
