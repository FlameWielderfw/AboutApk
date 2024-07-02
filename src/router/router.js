import { createRouter, createWebHistory } from 'vue-router'
import app from '../App.vue'
import blacklist from '../pages/BlackList.vue'
import first from '../pages/first.vue'

const routes = [
    { path: '/', redirect: '/pages/first' },
    {
        path: '/App',
        name: 'app',
        component: app
    },
    {
        path: '/pages/BlackList',
        name: ' BlackList',
        component: blacklist
    },
    {
        path: '/pages/first',
        name: 'first',
        component: first
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
