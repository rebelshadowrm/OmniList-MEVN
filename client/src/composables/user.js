import {reactive, readonly, computed} from 'vue'
import TokenService from "../TokenService";

const state = reactive({
    userData: {
        user: null
    },
    isLoggedIn: false,
    loading: false,
    error: "",
})

const getters = {
    getIsLoggedIn: () => {
        return computed(() => state.isLoggedIn)
    },
    getLoading: () => {
        return computed(() => state.loading)
    },
    getError: () => {
        return computed(() => state.error)
    },
    getUser: () => {
        return computed( () => state.userData)
    }
}

const setters = {
    setUser: (user) => {
        setters.setIsLoggedIn(true)
        state.userData.user = user
    },
    setIsLoggedIn: (loggedIn) => {
        state.isLoggedIn = loggedIn

        if (loggedIn === false) {
            state.userData.user = null
            TokenService.clearTokens()
        }
    },
    setLoading: (loadingStatus) => {
        state.loading = loadingStatus
    },
    setError: (error) => {
        state.error = error
    }
}

const methods = {
    decodeJWT: (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]))
        } catch (e) {
            return null
        }
    },
}

export default () => {
    return {
        state: readonly(state),
        ...getters,
        ...setters,
        ...methods,
    };
}
