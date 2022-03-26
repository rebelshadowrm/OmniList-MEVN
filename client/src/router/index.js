import {createRouter, createWebHistory} from "vue-router"
import Home from "../views/Home.vue"
import About from "../views/About.vue"
import Profile from "../views/Profile.vue";

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
    }
    ]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    linkExactActiveClass: "active"
})

export default router
