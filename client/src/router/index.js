import {createRouter, createWebHistory} from "vue-router"
import Home from "../views/Home.vue"
import About from "../views/About.vue"
import Profile from "../views/Profile.vue";
import Anime from "../views/Anime.vue"
import AnimeBrowse from "../views/AnimeBrowse.vue"
import Discussions from "../views/Discussions.vue"
import Discussion from "../views/Discussion.vue"
import Reviews from "../views/Reviews.vue"
import Review from "../views/Review.vue"
import Settings from "../views/Settings.vue";
import inbox from "../views/Inbox.vue";

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
        component: AnimeBrowse,
    },
    {
        path: '/anime/:id',
        name: 'Anime',
        component: Anime,
        props: true,
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
    }
    ]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    linkExactActiveClass: "active"
})

export default router
