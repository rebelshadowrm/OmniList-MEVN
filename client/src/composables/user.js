import {reactive, readonly, computed} from 'vue'
import TokenService from "../services/TokenService";
import UserService from "../services/UserService";
import useTheme from "./theme";

const state = reactive({
    userData: {
        user: null
    },
    isLoggedIn: false,
    isInitialized: false,
    loading: false,
    error: "",
})

let initializeUserPromise = null

const getters = {
    getIsLoggedIn: () => {
        return computed(() => state.isLoggedIn)
    },
    getIsInitialized: () => {
        return computed(() => state.isInitialized)
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
        setters.setIsInitialized(true)
        state.userData.user = user
    },
    setIsLoggedIn: (loggedIn) => {
        state.isLoggedIn = loggedIn

        if (loggedIn === false) {
            state.userData.user = null
            TokenService.clearTokens()
        }
    },
    setIsInitialized: (initialized) => {
        state.isInitialized = initialized
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
    initializeUser: async () => {
        const token = TokenService.getAccessToken()
        if (state.isInitialized && (state.userData.user || !token)) return state.userData.user
        if (initializeUserPromise) return initializeUserPromise

        initializeUserPromise = (async () => {
            if (!token) {
                methods.setupLocalTheme()
                setters.setIsInitialized(true)
                return null
            }

            const {_id} = methods.decodeJWT(token)?.user ?? {}
            if (!_id) {
                setters.setIsLoggedIn(false)
                setters.setIsInitialized(true)
                return null
            }

            const checkUser = await UserService.getUser(_id)
            if (checkUser?.status === 200) {
                setters.setUser(checkUser.data)
                methods.setupUserTheme(checkUser.data)
                setters.setIsInitialized(true)
                return checkUser.data
            }

            if (checkUser?.status === 401 || checkUser?.status === 403) {
                setters.setIsLoggedIn(false)
            }
            setters.setIsInitialized(true)
            return null
        })().finally(() => {
            initializeUserPromise = null
        })

        return initializeUserPromise
    },
    setupUserTheme: (user) => {
        const {setTheme, applyTheme} = useTheme()
        const colors = user?.userPreferences?.themes?.profileTheme
        setTheme(colors)
        applyTheme(colors)
    },
    setupLocalTheme: () => {
        const {getLocalColors, setTheme, applyTheme} = useTheme()
        const colors = getLocalColors()
        if (!colors) return

        setTheme(colors)
        applyTheme(colors)
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
