import axios from 'axios'
import TokenService from "./services/TokenService"


export const axiosAuth = axios.create()


// Add a request interceptor
axiosAuth.interceptors.request.use(
    config => {
        const token = TokenService.getAccessToken()
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        config.headers['Content-Type'] = 'application/json'
        return config;
    },
    error => {
        Promise.reject(error)
    })


//Add a response interceptor
axiosAuth.interceptors.response.use(
    async (response) => { return response },
    async (error) => {
        if(error.response && error.response.status === 403) {
            console.log('token expired')
            const retry = await resetTokenAndReattemptRequest(error)
            console.log('retrying request')
            return retry
        }
        return Promise.reject(error)
    })


let isAlreadyFetchingAccessToken = false

// This is the list of waiting requests that will retry after the JWT refresh complete
let subscribers = []

async function resetTokenAndReattemptRequest(error) {
    try {
        const { response: errorResponse } = error;
        // Your own mechanism to get the refresh token to refresh the JWT token
        const refreshToken = TokenService.getRefreshToken()
        if (!refreshToken) {
            console.log('no refresh token')
            // We can't refresh, throw the error anyway
            return Promise.reject(error)
        }
        /* Proceed to the token refresh procedure
        We create a new Promise that will retry the request,
        clone all the request configuration from the failed
        request in the error object. */
        const retryOriginalRequest = new Promise(async resolve => {
            /* We need to add the request retry to the queue
            since there another request that already attempt to
            refresh the token */
            await addSubscriber(access_token => {
                errorResponse.config.headers.Authorization = 'Bearer ' + access_token
                resolve(axios(errorResponse.config))
            })
        })
        if (!isAlreadyFetchingAccessToken) {
            console.log('fetching access token')
            isAlreadyFetchingAccessToken = true;
            const response = await axios({
                method: 'post',
                url: `/api/refresh`,
                data: {
                    token: refreshToken
                }
            })
            if (!response.data) {
                return Promise.reject(error)
            }
            const newToken = response.data.accessToken
            // save the newly refreshed token for other requests to use
            TokenService.setAccessToken(newToken)
            isAlreadyFetchingAccessToken = false
            await onAccessTokenFetched(newToken)
        }
        return retryOriginalRequest
    } catch (err) {
        return Promise.reject(err)
    }
}

async function onAccessTokenFetched(access_token) {
    // When the refresh is successful, we start retrying the requests one by one and empty the queue
    subscribers.forEach(callback => callback(access_token))
    subscribers = []
}

async function addSubscriber(callback) {
    subscribers.push(callback)
}