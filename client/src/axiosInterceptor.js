import axios from 'axios'
import TokenService from "./TokenService";

// Add a request interceptor
axios.interceptors.request.use(
    config => {
        const token = localStorageService.getAccessToken();
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        // config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    });


//Add a response interceptor
axios.interceptors.response.use(
    (response) => { return response },
    async (error) => {
        if(error.response && error.response.status === 401) {
                return resetTokenAndReattemptRequest(error)
            }
        return Promise.reject(error)
    })


let isAlreadyFetchingAccessToken = false;

// This is the list of waiting requests that will retry after the JWT refresh complete
let subscribers = [];

async function resetTokenAndReattemptRequest(error) {
    try {
        const { response: errorResponse } = error;
        // Your own mechanism to get the refresh token to refresh the JWT token
        const refreshToken = TokenService.getRefreshToken();
        if (!refreshToken) {
            // We can't refresh, throw the error anyway
            return Promise.reject(error);
        }
        /* Proceed to the token refresh procedure
        We create a new Promise that will retry the request,
        clone all the request configuration from the failed
        request in the error object. */
        const retryOriginalRequest = new Promise(resolve => {
            /* We need to add the request retry to the queue
            since there another request that already attempt to
            refresh the token */
            addSubscriber(access_token => {
                errorResponse.config.headers.Authorization = 'Bearer ' + access_token;
                resolve(axios(errorResponse.config));
            });
        });
        if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            const response = await axios({
                method: 'post',
                url: `/api/refresh`,
                data: {
                    token: refreshToken
                }
            });
            if (!response.data) {
                return Promise.reject(error);
            }
            const newToken = response.data.token;
            TokenService.setRefreshToken(newToken); // save the newly refreshed token for other requests to use
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(newToken);
        }
        return retryOriginalRequest;
    } catch (err) {
        return Promise.reject(err);
    }
}

function onAccessTokenFetched(access_token) {
    // When the refresh is successful, we start retrying the requests one by one and empty the queue
    subscribers.forEach(callback => callback(access_token));
    subscribers = [];
}

function addSubscriber(callback) {
    subscribers.push(callback);
}