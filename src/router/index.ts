import HelloWorld from '@/views/HelloWorld.vue'
import JobBoard from '@/views/JobBoard.vue'
import LogIn from '@/views/LogIn.vue'
import UserBoards from '@/views/UserBoards.vue'
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
    {
      path: '/boards',
      name: 'boards',
      component: UserBoards,
    },
    {
      path: '/board/:boardId',
      name: 'board',
      component: JobBoard,
      props: true,
    },
  ],
})

export default router
