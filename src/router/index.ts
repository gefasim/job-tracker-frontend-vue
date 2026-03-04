import HelloWorld from '@/views/HelloWorld.vue'
import LogIn from '@/views/LogIn.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'helloWorld',
      component: HelloWorld,
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn,
    },
  ],
})

export default router
