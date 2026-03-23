import HelloWorld from '@/views/HelloWorld.vue'
import JobApplicationModal from '@/views/JobApplication/JobApplicationModal.vue'
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
      path: '/boards/:boardId',
      name: 'board',
      component: JobBoard,
      props: true,
      children: [
        {
          path: '/boards/:boardId/jobs/:jobId/',
          name: 'job-application',
          component: JobApplicationModal,
          props: true,
        },
      ],
    },
  ],
})

export default router
