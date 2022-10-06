import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/tabs/Holidays'
    },
    {
        path: '/tabs/',
        component: TabsPage,
        children: [
            {
                name: 'Holidays',
                path: 'Holidays',
                component: () => import('@/views/HolidaysPage.vue')
            },
            {
                name: 'Profile',
                path: 'Profile',
                component: () => import('@/views/ProfilePage.vue')
            },
            {
                name: 'HolidayCreation',
                path: 'HolidayCreation',
                component: () => import ('../views/HolidayCreation.vue')
            },
            {
                name: 'TripPage',
                path: 'TripPage',
                component: () => import ('../views/TripPage.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
