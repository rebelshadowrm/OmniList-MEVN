import {createRouter, createWebHistory} from "vue-router"
import PostComponent from "../components/PostComponent";

const routes = [
    {
        path: '/',
        name: 'PostComponent',
        component: PostComponent
    },
    ]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
