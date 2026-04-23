import {createRouter, createWebHistory} from "vue-router"
import useUser from "../composables/user"
import Home from "../views/Home.vue"
import About from "../views/About.vue"
import Profile from "../views/Profile.vue";
import Media from "../views/Media.vue"
import MediaBrowse from "../views/MediaBrowse.vue"
import Discussions from "../views/Discussions.vue"
import Discussion from "../views/Discussion.vue"
import Reviews from "../views/Reviews.vue"
import Review from "../views/Review.vue"
import Settings from "../views/Settings.vue";
import inbox from "../views/Inbox.vue";
import AdminPanel from "../views/AdminPanel.vue";
import LoginRegister from "../views/LoginRegister.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/profile/:username',
        name: 'Profile',
        component: Profile,
        props: true
    },
    {
        path: '/anime',
        name: 'AnimeBrowse',
        component: MediaBrowse,
        props: {mediaType: 'ANIME'},
    },
    {
        path: '/manga',
        name: 'MangaBrowse',
        component: MediaBrowse,
        props: {mediaType: 'MANGA'},
    },
    {
        path: '/movies',
        name: 'MovieBrowse',
        component: MediaBrowse,
        props: {mediaType: 'MOVIE'},
    },
    {
        path: '/tv',
        name: 'TvBrowse',
        component: MediaBrowse,
        props: {mediaType: 'TV'},
    },
    {
        path: '/anime/:id',
        name: 'Anime',
        component: Media,
        props: route => ({
            ...route.params,
            mediaType: 'ANIME',
        }),
    },
    {
        path: '/manga/:id',
        name: 'Manga',
        component: Media,
        props: route => ({
            ...route.params,
            mediaType: 'MANGA',
        }),
    },
    {
        path: '/movies/:id',
        name: 'Movie',
        component: Media,
        props: route => ({
            ...route.params,
            mediaType: 'MOVIE',
        }),
    },
    {
        path: '/tv/:id',
        name: 'Tv',
        component: Media,
        props: route => ({
            ...route.params,
            mediaType: 'TV',
        }),
    },
    {
        path: '/discussion/:id',
        name: 'Discussion',
        component: Discussion,
        props: true,
    },
    {
        path: '/discussions',
        name: 'Discussions',
        component: Discussions,
    },
    {
        path: '/reviews',
        name: 'Reviews',
        component: Reviews,
    },
    {
        path: '/review/:id',
        name: 'Review',
        component: Review,
        props: true,
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings
    },
    {
        path: '/inbox',
        name: 'Inbox',
        component: inbox
    },
    {
        path: '/admin',
        name: 'AdminPanel',
        component: AdminPanel
    },
    {
        path: '/login',
        name: 'LoginRegister',
        component: LoginRegister
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    linkExactActiveClass: "active"
})

router.beforeEach(async (to, from, next) => {
    const {getIsLoggedIn, getUser, initializeUser} = useUser()
    await initializeUser()
    const isAuthenticated = getIsLoggedIn().value
    const {user} = getUser().value
    const authUser = async (to) => {

        // Logged in
        if(isAuthenticated) {
            if(to.name === 'Home') return true
            if(to.name === 'About') return true
            if(to.name === 'Profile') return true
            if(to.name === 'AnimeBrowse') return true
            if(to.name === 'MangaBrowse') return true
            if(to.name === 'MovieBrowse') return true
            if(to.name === 'TvBrowse') return true
            if(to.name === 'Anime') return true
            if(to.name === 'Manga') return true
            if(to.name === 'Movie') return true
            if(to.name === 'Tv') return true
            if(to.name === 'Discussions') return true
            if(to.name === 'Discussion') return true
            if(to.name === 'Reviews') return true
            if(to.name === 'Review') return true
            if(to.name === 'Settings') return true
            if(to.name === 'Inbox') return true

            // Admin/Mod only
            if(user?.role === 'ADMIN' || user?.role === 'MOD') {
                if(to.name === 'AdminPanel') return true
            }
        }

        // Logged out
        if(!isAuthenticated) {
            if(to.name === 'Home') return true
            if(to.name === 'About') return true
            if(to.name === 'AnimeBrowse') return true
            if(to.name === 'MangaBrowse') return true
            if(to.name === 'MovieBrowse') return true
            if(to.name === 'TvBrowse') return true
            if(to.name === 'Anime') return true
            if(to.name === 'Manga') return true
            if(to.name === 'Movie') return true
            if(to.name === 'Tv') return true
            if(to.name === 'Discussion') return true
            if(to.name === 'Review') return true
            if(to.name === 'LoginRegister') return true
        }
        return false
    }
    if (await authUser(to)){
        next()
    } else {
        next({name : 'Home'})
    }


})



export default router
