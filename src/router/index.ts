import { createRouter, createWebHistory } from 'vue-router'
import GestionePrioritaView from '@/views/GestionePrioritaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GestionePrioritaView
    },
    {
      path: '/info',
      name: 'info',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/InfoView.vue')
    },
    {
      path: '/liste',
      name: 'liste',
      component: () => import('../views/ListeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }  
  ]
})

export default router
