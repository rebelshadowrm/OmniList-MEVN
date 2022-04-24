class TokenService {


    static getAccessToken() {
        return localStorage.getItem('access_token')
    }
    static setAccessToken(access_token) {
        localStorage.setItem('access_token', access_token)
    }

    static setRefreshToken(refresh_token) {
        localStorage.setItem('refresh_token', refresh_token)
    }
    static getRefreshToken() {
        return localStorage.getItem('refresh_token')
    }

    static clearTokens() {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    }
}

export default TokenService;
